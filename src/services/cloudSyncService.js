import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  deleteDoc
} from '../firebase/config';

// Dedicated Global Cloud Storage ID for DZONE COLLECTION SURAT
let CLOUD_STORE_ID = 'ff808181a09d98f701a10b9582c77c45';
const STORAGE_CLOUD_ID_KEY = 'dzone_cloud_store_id_v2';
const STORAGE_DELETED_PRODUCT_IDS = 'dzone_deleted_product_ids_v3';

// Retrieve or fallback active cloud storage ID
try {
  const savedId = localStorage.getItem(STORAGE_CLOUD_ID_KEY);
  if (savedId && savedId.trim() !== '') {
    CLOUD_STORE_ID = savedId.trim();
  }
} catch (e) {}

let CLOUD_STORE_URL = `https://api.restful-api.dev/objects/${CLOUD_STORE_ID}`;

const DB_COLLECTION_PRODUCTS = 'dzone_products';
const DB_COLLECTION_MEDIA = 'dzone_media';
const DB_COLLECTION_REVIEWS = 'dzone_reviews';
const DB_COLLECTION_ORDERS = 'dzone_orders';

export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`LocalStorage quota exceeded for key "${key}". Product data and images are preserved in React memory & Firebase Firestore.`, err);
  }
};

// Persistent tracking helpers for deleted products
export const getDeletedProductIds = () => {
  try {
    const saved = localStorage.getItem(STORAGE_DELETED_PRODUCT_IDS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed.map(String));
    }
  } catch (e) {}
  return new Set();
};

export const markProductIdAsDeleted = (id) => {
  if (id === undefined || id === null) return;
  try {
    const deletedSet = getDeletedProductIds();
    deletedSet.add(String(id));
    localStorage.setItem(STORAGE_DELETED_PRODUCT_IDS, JSON.stringify(Array.from(deletedSet)));
  } catch (e) {}
};

export const clearDeletedProductIds = () => {
  try {
    localStorage.removeItem(STORAGE_DELETED_PRODUCT_IDS);
  } catch (e) {}
};

// Setup BroadcastChannel for real-time same-device tab/window syncing
let liveChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveChannel = new BroadcastChannel('dzone_cross_device_sync_channel');
  }
} catch (e) {}

// In-memory cache for full payload sync
let currentCloudCache = {
  products: null,
  media: null,
  reviews: null,
  orders: null
};

// Helper: Ensure deleted products are filtered out for cloud sync
const sanitizeForCloud = (dataContainer) => {
  if (!dataContainer || typeof dataContainer !== 'object') return dataContainer;
  const clone = JSON.parse(JSON.stringify(dataContainer));

  if (Array.isArray(clone.products)) {
    const deletedIds = getDeletedProductIds();
    clone.products = clone.products
      .filter((p) => p && p.id && !deletedIds.has(String(p.id)));
  }
  return clone;
};

/**
 * Fetch full data container from Cloud Storage across all devices
 */
export const fetchFullCloudData = async () => {
  const deletedIds = getDeletedProductIds();
  const filterDeletedProducts = (list) => {
    if (!Array.isArray(list)) return list;
    return list.filter((p) => p && p.id && !deletedIds.has(String(p.id)));
  };

  try {
    // 1. Try Firebase Firestore first if initialized
    if (db) {
      try {
        const productsSnap = await getDocs(collection(db, DB_COLLECTION_PRODUCTS));
        const fbProducts = [];
        productsSnap.forEach((docSnap) => {
          if (!deletedIds.has(docSnap.id)) {
            fbProducts.push({ id: docSnap.id, ...docSnap.data() });
          }
        });

        const mediaSnap = await getDocs(collection(db, DB_COLLECTION_MEDIA));
        let fbMedia = null;
        mediaSnap.forEach((d) => { if (d.id === 'main_banner') fbMedia = d.data(); });

        const reviewsSnap = await getDocs(collection(db, DB_COLLECTION_REVIEWS));
        const fbReviews = [];
        reviewsSnap.forEach((docSnap) => fbReviews.push({ id: docSnap.id, ...docSnap.data() }));

        const ordersSnap = await getDocs(collection(db, DB_COLLECTION_ORDERS));
        const fbOrders = [];
        ordersSnap.forEach((docSnap) => fbOrders.push({ id: docSnap.id, ...docSnap.data() }));

        if (fbProducts.length > 0 || fbMedia || fbReviews.length > 0 || fbOrders.length > 0) {
          return {
            products: filterDeletedProducts(fbProducts),
            media: fbMedia,
            reviews: fbReviews,
            orders: fbOrders
          };
        }
      } catch (fbErr) {
        console.warn('Firebase Firestore read fallback:', fbErr);
      }
    }

    // 2. Fetch from Global Public Cloud REST Store
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.data && typeof result.data === 'object') {
        const cleanedData = {
          ...result.data,
          products: filterDeletedProducts(result.data.products)
        };
        currentCloudCache = { ...currentCloudCache, ...cleanedData };
        return cleanedData;
      }
    } else if (res.status === 404) {
      await recreateCloudStore();
    }
  } catch (err) {
    console.warn('Cloud sync fetch warning:', err);
  }
  return null;
};

/**
 * Re-create cloud store bucket if endpoint resets
 */
const recreateCloudStore = async () => {
  try {
    // Populate cache with local storage items if empty
    if (!currentCloudCache.products) {
      try {
        const savedProds = localStorage.getItem('dzone_products_v2');
        if (savedProds) currentCloudCache.products = JSON.parse(savedProds);
      } catch (e) {}
    }
    const res = await fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'DZONE_COLLECTION_SURAT_GLOBAL_STORE_V2',
        data: sanitizeForCloud(currentCloudCache)
      })
    });
    if (res.ok) {
      const created = await res.json();
      if (created && created.id) {
        CLOUD_STORE_ID = created.id;
        CLOUD_STORE_URL = `https://api.restful-api.dev/objects/${CLOUD_STORE_ID}`;
        localStorage.setItem(STORAGE_CLOUD_ID_KEY, CLOUD_STORE_ID);
        console.log('⚡ Created new Cloud Store Bucket:', CLOUD_STORE_ID);
      }
    }
  } catch (e) {
    console.warn('Failed to recreate cloud store:', e);
  }
};

/**
 * Save full data container to Cloud Storage
 */
const pushContainerToCloud = async (newData) => {
  try {
    currentCloudCache = { ...currentCloudCache, ...newData };
    const safeData = sanitizeForCloud(currentCloudCache);

    // Broadcast live event to open tabs/windows on device with full intact payload
    if (liveChannel) {
      try {
        liveChannel.postMessage({ type: 'DZONE_CLOUD_UPDATE', data: currentCloudCache });
      } catch (e) {}
    }

    // Save to Global Public Cloud REST API
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'DZONE_COLLECTION_SURAT_GLOBAL_STORE_V2',
        data: safeData
      })
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 500) {
        await recreateCloudStore();
        await fetch(CLOUD_STORE_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'DZONE_COLLECTION_SURAT_GLOBAL_STORE_V2',
            data: safeData
          })
        });
      }
    }
  } catch (err) {
    console.warn('Push to cloud warning:', err);
  }
};

// ----------------------------------------------------
// 1. PRODUCTS CLOUD SYNC
// ----------------------------------------------------
export const syncProductsToCloud = async (products) => {
  try {
    const deletedIds = getDeletedProductIds();
    const cleanProducts = (products || []).filter(p => p && p.id && !deletedIds.has(String(p.id)));

    safeSetLocalStorage('dzone_products_v2', JSON.stringify(cleanProducts));

    if (db) {
      try {
        const productsCol = collection(db, DB_COLLECTION_PRODUCTS);
        const existingSnap = await getDocs(productsCol);
        for (const docSnap of existingSnap.docs) {
          if (!cleanProducts.some(p => String(p.id) === docSnap.id) || deletedIds.has(docSnap.id)) {
            await deleteDoc(doc(db, DB_COLLECTION_PRODUCTS, docSnap.id));
          }
        }
        for (const prod of cleanProducts) {
          if (prod && prod.id) {
            await setDoc(doc(productsCol, String(prod.id)), prod, { merge: true });
          }
        }
      } catch (e) {
        console.error("Firebase Firestore sync error:", e);
        throw e;
      }
    }

    await pushContainerToCloud({ products: cleanProducts });
    window.dispatchEvent(new CustomEvent('dzone_cloud_update', { detail: { type: 'products', data: cleanProducts } }));
  } catch (err) {
    console.error('Cloud product sync error:', err);
    throw err;
  }
};

export const fetchCloudProducts = async () => {
  const data = await fetchFullCloudData();
  return data?.products || null;
};

// ----------------------------------------------------
// 2. HOMEPAGE MEDIA BANNERS CLOUD SYNC
// ----------------------------------------------------
export const syncMediaToCloud = async (media) => {
  try {
    localStorage.setItem('dzone_homepage_media_v1', JSON.stringify(media));

    if (db) {
      try {
        await setDoc(doc(db, DB_COLLECTION_MEDIA, 'main_banner'), media, { merge: true });
      } catch (e) {}
    }

    await pushContainerToCloud({ media });
    window.dispatchEvent(new CustomEvent('dzone_cloud_update', { detail: { type: 'media', data: media } }));
  } catch (err) {
    console.warn('Cloud media sync warning:', err);
  }
};

export const fetchCloudMedia = async () => {
  const data = await fetchFullCloudData();
  return data?.media || null;
};

// ----------------------------------------------------
// 3. REVIEWS CLOUD SYNC
// ----------------------------------------------------
export const syncReviewsToCloud = async (reviews) => {
  try {
    localStorage.setItem('dzone_reviews_v1', JSON.stringify(reviews));

    if (db) {
      try {
        const reviewsCol = collection(db, DB_COLLECTION_REVIEWS);
        const existingSnap = await getDocs(reviewsCol);
        const currentIds = new Set((reviews || []).map((r) => String(r.id)));
        for (const docSnap of existingSnap.docs) {
          if (!currentIds.has(docSnap.id)) {
            await deleteDoc(doc(db, DB_COLLECTION_REVIEWS, docSnap.id));
          }
        }
        for (const rev of (reviews || [])) {
          if (rev && rev.id) {
            await setDoc(doc(reviewsCol, String(rev.id)), rev, { merge: true });
          }
        }
      } catch (e) {}
    }

    await pushContainerToCloud({ reviews });
    window.dispatchEvent(new CustomEvent('dzone_cloud_update', { detail: { type: 'reviews', data: reviews } }));
  } catch (err) {
    console.warn('Cloud reviews sync warning:', err);
  }
};

// ----------------------------------------------------
// 4. ORDERS CLOUD SYNC
// ----------------------------------------------------
export const syncOrdersToCloud = async (orders) => {
  try {
    localStorage.setItem('dzone_orders_v1', JSON.stringify(orders));

    if (db) {
      try {
        const ordersCol = collection(db, DB_COLLECTION_ORDERS);
        const existingSnap = await getDocs(ordersCol);
        const currentIds = new Set((orders || []).map((o) => String(o.id)));
        for (const docSnap of existingSnap.docs) {
          if (!currentIds.has(docSnap.id)) {
            await deleteDoc(doc(db, DB_COLLECTION_ORDERS, docSnap.id));
          }
        }
        for (const ord of (orders || [])) {
          if (ord && ord.id) {
            await setDoc(doc(ordersCol, String(ord.id)), ord, { merge: true });
          }
        }
      } catch (e) {}
    }

    await pushContainerToCloud({ orders });
    window.dispatchEvent(new CustomEvent('dzone_cloud_update', { detail: { type: 'orders', data: orders } }));
  } catch (err) {
    console.warn('Cloud orders sync warning:', err);
  }
};

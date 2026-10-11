import React, { useState } from 'react';
import { getAssetUrl, compressImageFile, uploadImageFileToStorage, getProductImages } from '../utils/assetHelper';
import { getFirebaseConfig, saveFirebaseConfig } from '../firebase/config';
import {
  Folder,
  Image,
  Star,
  Lock,
  Plus,
  Edit,
  Trash2,
  Check,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Filter,
  LogOut,
  ShoppingBag,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Search
} from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialProducts';
import { 
  syncProductsToCloud, 
  syncMediaToCloud, 
  syncReviewsToCloud, 
  syncOrdersToCloud 
} from '../services/cloudSyncService';

export default function AdminPage({
  products,
  homepageMedia,
  reviews,
  orders = [],
  adminAuth,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdateHomepageMedia,
  onDeleteReview,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateAdminAuth,
  onResetDefaults,
  onImportProducts,
  onLogout
}) {
  const [adminTab, setAdminTab] = useState('orders'); // 'orders', 'products', 'homepage', 'reviews', 'security'
  const [productCategoryTab, setProductCategoryTab] = useState('WATCHES'); // WATCHES, BELTS, JEWELLERY, PERFUMES
  const [productSubcategoryTab, setProductSubcategoryTab] = useState('All');
  const [activeFormState, setActiveFormState] = useState('list'); // 'list', 'add', 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Multi-Image Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'WATCHES',
    subcategory: 'Premium Watches',
    price: '',
    inStock: true,
    image: '',
    images: [],
    shortDescription: ''
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imagesMarkedForDeletion, setImagesMarkedForDeletion] = useState([]);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Multi-Image Gallery Form Helpers
  const handleAddImage = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return;
    const cleanUrl = url.trim();
    setFormData((prev) => {
      const currentImgs = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
      if (currentImgs.length >= 4) {
        alert('Maximum 4 images allowed per product.');
        return prev;
      }
      const updated = [...currentImgs, cleanUrl];
      return {
        ...prev,
        images: updated,
        image: updated[0] || ''
      };
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    const currentImgs = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
    if (index < 0 || index >= currentImgs.length) return;

    const targetImg = currentImgs[index];

    // Confirmation when removing an existing saved photo in edit mode
    if (activeFormState === 'edit' && targetImg && !targetImg.startsWith('data:')) {
      const confirmRemove = window.confirm('Remove this product photo?');
      if (!confirmRemove) return;
    }

    // Track for deletion if remote storage URL
    if (targetImg && typeof targetImg === 'string' && (targetImg.startsWith('http://') || targetImg.startsWith('https://'))) {
      setImagesMarkedForDeletion((prev) => [...prev, targetImg]);
    }

    const updated = currentImgs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updated,
      image: updated[0] || ''
    });
  };

  const handleSetPrimaryImage = (index) => {
    const currentImgs = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
    if (index <= 0 || index >= currentImgs.length) return;
    const target = currentImgs[index];
    const rest = currentImgs.filter((_, i) => i !== index);
    const updated = [target, ...rest];
    setFormData({
      ...formData,
      images: updated,
      image: target
    });
  };

  const handleMoveImage = (index, direction) => {
    const currentImgs = [...(Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []))];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentImgs.length) return;

    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[targetIndex];
    currentImgs[targetIndex] = temp;

    setFormData({
      ...formData,
      images: currentImgs,
      image: currentImgs[0] || ''
    });
  };

  // Security Credentials Form State
  const [credUser, setCredUser] = useState(adminAuth?.username || 'dzone');
  const [credPass, setCredPass] = useState(adminAuth?.password || 'dzone123');

  // Firebase Cloud Sync Configuration State
  const [fbConfig, setFbConfig] = useState(() => getFirebaseConfig());
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    const cleanStr = (s) => (typeof s === 'string' ? s.replace(/^["'\s]+|["',\s]+$/g, '').trim() : s);
    const cleaned = {
      apiKey: cleanStr(fbConfig.apiKey),
      authDomain: cleanStr(fbConfig.authDomain),
      projectId: cleanStr(fbConfig.projectId),
      storageBucket: cleanStr(fbConfig.storageBucket),
      messagingSenderId: cleanStr(fbConfig.messagingSenderId),
      appId: cleanStr(fbConfig.appId),
      measurementId: cleanStr(fbConfig.measurementId)
    };
    saveFirebaseConfig(cleaned);
    setFbConfig(cleaned);
    alert('Firebase credentials updated and saved successfully! Page will now reload to activate the connection.');
    window.location.reload();
  };

  const categories = ['WATCHES', 'BELTS', 'JEWELLERY', 'PERFUMES'];

  // Convert & Compress / Upload File to Firebase Storage / Data URL for Drag & Drop / Device picker
  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    try {
      const imgUrl = await uploadImageFileToStorage(file);
      if (imgUrl) {
        callback(imgUrl);
      } else {
        const base64 = await compressImageFile(file, 800, 0.75);
        if (base64) callback(base64);
      }
    } catch (err) {
      console.warn('Image upload fallback to compressed image:', err);
      try {
        const base64 = await compressImageFile(file, 800, 0.75);
        if (base64) callback(base64);
      } catch (fallbackErr) {
        alert('Could not process image file. Please try choosing a different photo.');
      }
    }
  };

  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    const imgs = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : (product.image ? [product.image] : []);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      inStock: product.inStock,
      image: imgs[0] || product.image || '',
      images: imgs,
      shortDescription: product.shortDescription || ''
    });
    setNewImageUrl('');
    setImagesMarkedForDeletion([]);
    setActiveFormState('edit');
  };

  const handleStartAdd = () => {
    setEditingProductId(null);
    const defaultSub = CATEGORIES_CONFIG[productCategoryTab]?.subcategories[1] || 'General';
    setFormData({
      name: '',
      category: productCategoryTab,
      subcategory: defaultSub,
      price: '',
      inStock: true,
      image: '',
      images: [],
      shortDescription: ''
    });
    setNewImageUrl('');
    setImagesMarkedForDeletion([]);
    setActiveFormState('add');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const imgs = Array.isArray(formData.images) ? formData.images.filter((img) => img && typeof img === 'string' && img.trim() !== '') : [];

    if (!formData.name || !formData.price) {
      alert('Please fill in Product Name and Price.');
      return;
    }

    if (imgs.length > 4) {
      alert('Maximum 4 images allowed per product.');
      return;
    }

    const payload = {
      ...formData,
      image: imgs[0] || '',
      images: imgs,
      price: Number(formData.price)
    };

    setIsSavingProduct(true);
    try {
      if (activeFormState === 'edit' && editingProductId) {
        await onUpdateProduct(editingProductId, payload);
      } else {
        await onAddProduct(payload);
      }
      setProductCategoryTab(formData.category);
      setProductSubcategoryTab('All');
      setActiveFormState('list');
      alert(`Product "${formData.name}" saved successfully!`);
    } catch (err) {
      console.error('Save product error:', err);
      alert(`Error saving product: ${err.message || err}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Subcategory list for active category
  const availableSubcategories = CATEGORIES_CONFIG[productCategoryTab]?.subcategories || ['All'];

  // Filter products by selected admin category & subcategory tabs
  const categoryProducts = products.filter((p) => {
    const matchesCategory = p.category === productCategoryTab;
    const matchesSubcategory =
      productSubcategoryTab === 'All' ||
      p.subcategory === productSubcategoryTab ||
      p.type === productSubcategoryTab;
    return matchesCategory && matchesSubcategory;
  });

  // Filter Orders/Leads
  const filteredOrders = orders.filter((o) => {
    if (!o) return false;
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const q = (orderSearchQuery || '').toLowerCase();
    const matchesSearch =
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.mobile && o.mobile.includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q)) ||
      (o.productName && o.productName.toLowerCase().includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.city && o.city.toLowerCase().includes(q)) ||
      (o.pincode && o.pincode.includes(q));
    return matchesStatus && matchesSearch;
  });

  // Export Orders to CSV
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = "Order ID,Customer Name,Mobile,Email,Address,City,Pincode,Product Name,Category,Price,Qty,Total,Status,Date\n";
    const rows = orders.map((o) =>
      `"${o.id}","${o.customerName}","${o.mobile}","${o.email}","${o.address}","${o.city}","${o.pincode}","${o.productName}","${o.productCategory}",${o.productPrice},${o.quantity || 1},${o.totalPrice || o.productPrice},"${o.status}","${o.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dzone_customer_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Export catalog JSON file download
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dzone_catalog_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import catalog JSON file
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportProducts(parsed);
            alert(`Successfully imported ${parsed.length} products!`);
          } else {
            alert('Invalid JSON structure.');
          }
        } catch (err) {
          alert('Error parsing JSON file.');
        }
      };
    }
  };

  // Security credentials save
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    onUpdateAdminAuth({ username: credUser, password: credPass });
    alert('Admin username and password updated successfully!');
  };

  const [syncingCloud, setSyncingCloud] = useState(false);

  const handleManualCloudSync = async () => {
    setSyncingCloud(true);
    try {
      await Promise.all([
        syncProductsToCloud(products),
        syncMediaToCloud(homepageMedia),
        syncReviewsToCloud(reviews),
        syncOrdersToCloud(orders)
      ]);
      alert('⚡ Live Cloud Sync Complete! All products, photos, and orders are now updated across all mobile devices & browsers.');
    } catch (err) {
      alert('Cloud Sync notification: Products updated locally. Cloud backup will retry automatically.');
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="admin-page-root">
      {/* Standalone Top Bar */}
      <header className="admin-page-header">
        <div className="admin-header-brand">
          <img src={getAssetUrl('dzone_logo.png')} alt="DZONE Logo" className="admin-brand-logo-img" />
          <div>
            <h1>DZONE COLLECTION SURAT</h1>
            <span className="admin-header-sub">
              STORE MANAGEMENT CONSOLE • <strong style={{ color: '#10B981' }}>🟢 Live Cross-Device Cloud Sync Active</strong>
            </span>
          </div>
        </div>

        <div className="admin-header-actions">
          <button 
            className="admin-btn-action" 
            onClick={handleManualCloudSync} 
            disabled={syncingCloud}
            style={{ backgroundColor: '#10B981', color: '#ffffff', borderColor: '#10B981', fontWeight: 600 }}
            title="Push all products & changes to all mobile devices immediately"
          >
            {syncingCloud ? '⚡ Syncing Cloud...' : '⚡ Sync All to Phone/Devices'}
          </button>

          <button className="admin-btn-action" onClick={handleExportJSON} title="Export Catalog Backup">
            <Download size={15} /> Export Catalog
          </button>

          <label className="admin-btn-action" title="Import Catalog Backup">
            <Upload size={15} /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>

          <button className="admin-btn-viewsite" onClick={onLogout}>
            <ExternalLink size={15} /> View Public Website
          </button>
        </div>
      </header>

      {/* Main Admin Layout Grid */}
      <div className="admin-page-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${adminTab === 'orders' ? 'active' : ''}`}
              onClick={() => setAdminTab('orders')}
            >
              <ShoppingBag size={18} /> Customer Leads & Orders ({orders.length})
            </button>
            <button
              className={`sidebar-nav-item ${adminTab === 'products' ? 'active' : ''}`}
              onClick={() => { setAdminTab('products'); setActiveFormState('list'); }}
            >
              <Folder size={18} /> Category Products ({products.length})
            </button>
            <button
              className={`sidebar-nav-item ${adminTab === 'homepage' ? 'active' : ''}`}
              onClick={() => setAdminTab('homepage')}
            >
              <Image size={18} /> Homepage Banners & Photos
            </button>
            <button
              className={`sidebar-nav-item ${adminTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setAdminTab('reviews')}
            >
              <Star size={18} /> Customer Reviews ({reviews.length})
            </button>
            <button
              className={`sidebar-nav-item ${adminTab === 'security' ? 'active' : ''}`}
              onClick={() => setAdminTab('security')}
            >
              <Lock size={18} /> Login Credentials
            </button>
          </nav>

          <div className="sidebar-footer-card">
            <div className="card-store-name">DZONE COLLECTION</div>
            <p>G-23, Royal Arcade, Surat</p>
            <button className="sidebar-logout-btn" onClick={onLogout}>
              <LogOut size={14} /> Exit Admin Console
            </button>
          </div>
        </aside>

        {/* Main Console Content Body */}
        <main className="admin-main-content">
          {/* TAB 0: CUSTOMER LEADS & ORDERS */}
          {adminTab === 'orders' && (
            <div className="admin-card-panel">
              <div className="panel-header-row">
                <div>
                  <h2 className="panel-title">Customer Leads & Buy Orders ({orders.length})</h2>
                  <p className="panel-sub">Real-time order requests submitted by customers with contact & shipping details</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      try {
                        const saved = localStorage.getItem('dzone_orders_v1');
                        if (saved) {
                          const parsed = JSON.parse(saved);
                          if (Array.isArray(parsed)) {
                            window.dispatchEvent(new CustomEvent('dzone_orders_updated', { detail: parsed }));
                            alert(`Found ${parsed.length} total customer leads in storage!`);
                          }
                        }
                      } catch (e) {}
                    }}
                    title="Refresh orders from storage"
                  >
                    <RotateCcw size={14} /> Refresh Leads ({orders.length})
                  </button>

                  <button className="btn btn-outline btn-sm" onClick={handleExportOrdersCSV}>
                    <Download size={14} /> Export Leads CSV
                  </button>
                </div>
              </div>

              {/* Order Status Filters & Search */}
              <div className="orders-filter-bar">
                <div className="order-status-pills">
                  {['All', 'New Lead', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      className={`subcat-admin-chip ${orderStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setOrderStatusFilter(st)}
                    >
                      {st} ({st === 'All' ? orders.length : orders.filter(o => o?.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="search-box" style={{ maxWidth: 280 }}>
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by customer name, mobile, address..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="admin-table-container">
                <table className="admin-full-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name & Contact</th>
                      <th>Delivery Address</th>
                      <th>Product & Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-table-cell">
                          No customer leads found matching filter. (Total orders: {orders.length})
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <strong style={{ color: 'var(--accent-gold-dark)', fontSize: '0.95rem' }}>{o.id}</strong>
                            <div className="order-date-text">{o.createdAt}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                              👤 {o.customerName || 'Customer'}
                            </div>
                            <div className="contact-detail-line">
                              <Phone size={12} /> <a href={`tel:${o.mobile}`} style={{ fontWeight: 600 }}>{o.mobile}</a>
                            </div>
                            {o.email && o.email !== 'Not provided' && (
                              <div className="contact-detail-line">
                                <Mail size={12} /> {o.email}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="address-box-cell" style={{ fontSize: '0.85rem' }}>
                              <MapPin size={13} style={{ display: 'inline', marginRight: 4, color: 'var(--accent-gold)' }} />
                              {o.address},<br />
                              <strong>{o.city} - {o.pincode}</strong>
                            </div>
                          </td>
                          <td>
                            <strong className="table-product-title">{o.productName}</strong>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: 2 }}>
                              <span className="badge badge-gold">{o.productCategory}</span>
                              <span className="badge" style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 700 }}>
                                ⚡ Prepaid UPI
                              </span>
                            </div>
                            <div className="table-price-cell" style={{ marginTop: 4 }}>
                              ₹{(o.totalPrice || o.productPrice || 0).toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>(Qty: {o.quantity || 1})</span>
                            </div>
                            {o.utrNo && o.utrNo !== 'Pending verification' && (
                              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2, background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: 4, display: 'inline-block' }}>
                                🔑 UTR: <strong>{o.utrNo}</strong>
                              </div>
                            )}
                          </td>
                          <td>
                            <select
                              value={o.status || 'New Lead'}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                              className={`status-dropdown status-${(o.status || 'new-lead').toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <option value="New Lead">🔴 New Lead</option>
                              <option value="Confirmed">🟡 Confirmed</option>
                              <option value="Shipped">🔵 Shipped</option>
                              <option value="Delivered">🟢 Delivered</option>
                              <option value="Cancelled">⚫ Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="row-action-btns">
                              <a
                                href={`https://wa.me/91${(o.mobile || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(o.customerName || '')}%2C%20this%20is%20DZONE%20COLLECTION%20Surat%20regarding%20your%20order%20%23${o.id}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="action-icon wa-btn"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle size={15} /> WhatsApp
                              </a>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete order lead ${o.id}?`)) {
                                    onDeleteOrder(o.id);
                                  }
                                }}
                                className="action-icon delete"
                                title="Delete Order"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 1: CATEGORY & SUBCATEGORY PRODUCTS */}
          {adminTab === 'products' && (
            <div className="admin-card-panel">
              <div className="panel-header-row">
                <div>
                  <h2 className="panel-title">Product Catalog Management</h2>
                  <p className="panel-sub">Organize, edit, add, or toggle availability category-wise</p>
                </div>

                <button className="btn btn-primary" onClick={handleStartAdd}>
                  <Plus size={16} /> Add New {productCategoryTab} Product
                </button>
              </div>

              {/* Main Category Bar */}
              <div className="cat-selector-bar">
                <span className="cat-label">Main Category:</span>
                {categories.map((catKey) => (
                  <button
                    key={catKey}
                    className={`cat-pill ${productCategoryTab === catKey ? 'active' : ''}`}
                    onClick={() => {
                      setProductCategoryTab(catKey);
                      setProductSubcategoryTab('All');
                      setActiveFormState('list');
                    }}
                  >
                    {catKey} ({products.filter((p) => p.category === catKey).length})
                  </button>
                ))}
              </div>

              {/* Subcategory Bar */}
              <div className="subcat-admin-bar">
                <span className="subcat-admin-label"><Filter size={14} /> Subcategory Filter:</span>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    className={`subcat-admin-chip ${productSubcategoryTab === sub ? 'active' : ''}`}
                    onClick={() => {
                      setProductSubcategoryTab(sub);
                      setActiveFormState('list');
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {activeFormState === 'list' && (
                <div className="admin-table-container">
                  <table className="admin-full-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Subcategory</th>
                        <th>Price</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-table-cell">
                            No products found in <strong>{productCategoryTab} &gt; {productSubcategoryTab}</strong>.<br />
                            Click "+ Add New {productCategoryTab} Product" to add items.
                          </td>
                        </tr>
                      ) : (
                        categoryProducts.map((p) => (
                          <tr key={p.id}>
                            <td>
                              {getProductImages(p)[0] ? (
                                <img
                                  src={getProductImages(p)[0]}
                                  alt={p.name}
                                  className="table-product-thumb"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="table-product-thumb" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>No Photo</div>
                              )}
                            </td>
                            <td>
                              <strong className="table-product-title">{p.name}</strong>
                              {p.shortDescription && (
                                <p className="table-product-desc">{p.shortDescription}</p>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-gold">{p.subcategory || 'General'}</span>
                            </td>
                            <td className="table-price-cell">₹{Number(p.price).toLocaleString('en-IN')}</td>
                            <td>
                              <button
                                onClick={() => onToggleStock(p.id)}
                                className={`badge ${p.inStock ? 'badge-in-stock' : 'badge-out-stock'} toggle-stock-btn`}
                              >
                                {p.inStock ? 'Available in Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td>
                              <div className="row-action-btns">
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="action-icon edit"
                                  title="Edit Product"
                                >
                                  <Edit size={16} /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete "${p.name}"?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="action-icon delete"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {(activeFormState === 'add' || activeFormState === 'edit') && (
                <form onSubmit={handleProductSubmit} className="admin-full-form">
                  <div className="form-header-row">
                    <h3>{activeFormState === 'edit' ? `Edit Product: ${formData.name}` : `Add Product in ${productCategoryTab}`}</h3>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setActiveFormState('list')}>
                      Back to Table
                    </button>
                  </div>

                  <div className="form-layout-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Skeleton Diamond Watch / Kadi Belt"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Main Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const sub = CATEGORIES_CONFIG[cat]?.subcategories[1] || 'General';
                          setFormData({ ...formData, category: cat, subcategory: sub });
                          setProductCategoryTab(cat);
                          setProductSubcategoryTab('All');
                        }}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Subcategory *</label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      >
                        {CATEGORIES_CONFIG[formData.category]?.subcategories
                          .filter((s) => s !== 'All')
                          .map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="e.g. 2499"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    {/* Multi-Image Product Gallery Management */}
                    <div className="form-group full-width">
                      <div className="multi-img-header-bar">
                        <label className="multi-img-title">
                          Product Gallery Photos (Min: 1 • Recommended: 3–4 • Max: 4 Photos) *
                        </label>
                        <span className="img-count-badge">
                          {(formData.images || []).length} / 4 Photos
                        </span>
                      </div>
                      <p className="form-hint-text">
                        The 1st photo is used as the <strong>Primary Cover Photo</strong> on product cards. Customers can browse all 1–4 photos in the product slider.
                      </p>

                      {/* Attached Gallery Images Grid */}
                      <div className="admin-photos-gallery-grid">
                        {(formData.images || []).map((imgUrl, idx) => (
                          <div key={idx} className={`admin-photo-card ${idx === 0 ? 'is-primary' : ''}`}>
                            <div className="admin-photo-preview-wrap">
                              <img
                                src={imgUrl}
                                alt={`Product photo ${idx + 1}`}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {idx === 0 && <span className="primary-cover-badge">★ PRIMARY COVER</span>}
                              <span className="photo-num-tag">Photo #{idx + 1}</span>
                            </div>

                            <div className="admin-photo-actions">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  className="btn-photo-action primary"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  title="Set as primary cover photo"
                                >
                                  ★ Make Primary
                                </button>
                              )}

                              <div className="photo-order-btns">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  className="btn-photo-action nav"
                                  onClick={() => handleMoveImage(idx, -1)}
                                  title="Move Left"
                                >
                                  ← Left
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (formData.images || []).length - 1}
                                  className="btn-photo-action nav"
                                  onClick={() => handleMoveImage(idx, 1)}
                                  title="Move Right"
                                >
                                  Right →
                                </button>
                                <button
                                  type="button"
                                  className="btn-photo-action delete"
                                  onClick={() => handleRemoveImage(idx)}
                                  title="Remove this image"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Photo Container (File Upload or URL) */}
                      {(formData.images?.length || 0) < 4 ? (
                        <div className="device-upload-container" style={{ marginTop: '1rem' }}>
                          <h5 className="add-img-subheading">+ Upload Photo #{ (formData.images?.length || 0) + 1 }</h5>

                          <div
                            className="drag-drop-dropzone"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                handleFileUpload(e.dataTransfer.files[0], (base64) =>
                                  handleAddImage(base64)
                                );
                              }
                            }}
                          >
                            <Image size={24} className="text-gold" />
                            <p>Drag & Drop Product Photo Here OR</p>
                            <label className="btn btn-outline btn-sm">
                              📁 Choose Photo from Device
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0], (base64) =>
                                      handleAddImage(base64)
                                    );
                                    e.target.value = '';
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>

                          <div className="image-url-row">
                            <span>Or Paste Image URL:</span>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddImage(newImageUrl);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAddImage(newImageUrl)}
                            >
                              + Add Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="max-photos-reached-banner">
                          ✓ Maximum 4 photos attached for this product. Remove a photo above if you want to replace it.
                        </div>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Short Description</label>
                      <textarea
                        rows="3"
                        placeholder="Provide details about materials, design, warranty, or sizing..."
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="form-group full-width checkbox-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        />
                        Product is Available in Stock
                      </label>
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button type="button" className="btn btn-outline" onClick={() => setActiveFormState('list')} disabled={isSavingProduct}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSavingProduct}>
                      <Check size={16} /> {isSavingProduct ? 'Saving to Firebase...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: HOMEPAGE BANNERS & PHOTOS */}
          {adminTab === 'homepage' && (
            <div className="admin-card-panel">
              <div className="panel-header-row">
                <div>
                  <h2 className="panel-title">Homepage Photos & Banners Control</h2>
                  <p className="panel-sub">Select files from your device to replace any photo on the customer homepage</p>
                </div>
              </div>

              <div className="homepage-photos-grid">
                {/* Hero Photo 1 */}
                <div className="homepage-photo-card">
                  <h4>Hero Visual Photo 1 (Watches Banner)</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.heroImage1} alt="Hero 1" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ heroImage1: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Hero Photo 2 */}
                <div className="homepage-photo-card">
                  <h4>Hero Visual Photo 2 (Perfumes Banner)</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.heroImage2} alt="Hero 2" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ heroImage2: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Hero Photo 3 */}
                <div className="homepage-photo-card">
                  <h4>Hero Visual Photo 3 (Belts Banner)</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.heroImage3 || "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop"} alt="Hero 3" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ heroImage3: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Hero Photo 4 */}
                <div className="homepage-photo-card">
                  <h4>Hero Visual Photo 4 (Jewellery Banner)</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.heroImage4 || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"} alt="Hero 4" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ heroImage4: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Category WATCHES */}
                <div className="homepage-photo-card">
                  <h4>WATCHES Main Category Banner</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.categoryImage_WATCHES} alt="Watches" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ categoryImage_WATCHES: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Category BELTS */}
                <div className="homepage-photo-card">
                  <h4>BELTS Main Category Banner</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.categoryImage_BELTS} alt="Belts" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ categoryImage_BELTS: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Category JEWELLERY */}
                <div className="homepage-photo-card">
                  <h4>JEWELLERY Main Category Banner</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.categoryImage_JEWELLERY} alt="Jewellery" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ categoryImage_JEWELLERY: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Category PERFUMES */}
                <div className="homepage-photo-card">
                  <h4>PERFUMES Main Category Banner</h4>
                  <div className="photo-preview">
                    <img src={homepageMedia.categoryImage_PERFUMES} alt="Perfumes" />
                  </div>
                  <label className="btn btn-outline btn-sm full-w">
                    📁 Choose New Photo from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], (base64) =>
                            onUpdateHomepageMedia({ categoryImage_PERFUMES: base64 })
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS */}
          {adminTab === 'reviews' && (
            <div className="admin-card-panel">
              <div className="panel-header-row">
                <div>
                  <h2 className="panel-title">Customer Feedback & Reviews Control</h2>
                  <p className="panel-sub">Manage ratings and feedback submitted by Surat shoppers</p>
                </div>
              </div>

              <div className="reviews-table-wrap">
                {reviews.map((rev) => (
                  <div key={rev.id} className="admin-review-card">
                    <div className="rev-card-info">
                      <div className="rev-header">
                        <strong>{rev.name}</strong> ({rev.location})
                        <span className="rev-stars">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="rev-comment">"{rev.comment}"</p>
                      <span className="rev-date">{rev.date}</span>
                    </div>

                    <button
                      className="btn btn-outline btn-sm danger"
                      onClick={() => onDeleteReview(rev.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & CLOUD CONNECTIVITY SETTINGS */}
          {adminTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 }}>
              {/* Card 1: Admin Login Credentials */}
              <div className="admin-card-panel">
                <div className="panel-header-row">
                  <div>
                    <h2 className="panel-title">Security & Password Settings</h2>
                    <p className="panel-sub">Change your Admin Console Login Credentials</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSecurity} className="admin-full-form">
                  <div className="form-group">
                    <label>Admin Username</label>
                    <input
                      type="text"
                      required
                      value={credUser}
                      onChange={(e) => setCredUser(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Admin Password</label>
                    <input
                      type="password"
                      required
                      value={credPass}
                      onChange={(e) => setCredPass(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }}>
                    <Check size={16} /> Save New Credentials
                  </button>
                </form>
              </div>

              {/* Card 2: Live Website & Admin Link Connection */}
              <div className="admin-card-panel">
                <div className="panel-header-row">
                  <div>
                    <h2 className="panel-title">🌐 Connected Live Website Links</h2>
                    <p className="panel-sub">Direct access links for customer website and store admin portal</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>🛍️ Live Public Website Link (For Customers):</strong>
                    <a href="https://mandipmori77-ui.github.io/Dzone-collection/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', fontWeight: 600, wordBreak: 'break-all' }}>
                      https://mandipmori77-ui.github.io/Dzone-collection/
                    </a>
                  </div>

                  <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>🔐 Admin Console Direct Link (For Store Owner):</strong>
                    <a href="https://mandipmori77-ui.github.io/Dzone-collection/#admin" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', fontWeight: 600, wordBreak: 'break-all' }}>
                      https://mandipmori77-ui.github.io/Dzone-collection/#admin
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a href="https://mandipmori77-ui.github.io/Dzone-collection/" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      <ExternalLink size={14} /> Open Live Website
                    </a>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText('https://mandipmori77-ui.github.io/Dzone-collection/#admin');
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                    >
                      {copiedLink ? '✓ Admin Link Copied!' : 'Copy Admin Direct Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Firebase Cloud Database Connection */}
              <div className="admin-card-panel">
                <div className="panel-header-row">
                  <div>
                    <h2 className="panel-title">🔥 Firebase Real-Time Cloud Sync</h2>
                    <p className="panel-sub">Sync changes made in Admin Console instantly to live customer devices</p>
                  </div>
                </div>

                <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ✓ Real-time Cross-Device Cloud Sync Active: Any changes to products, prices, stock, or banners instantly update across all live customer mobile phones.
                </div>

                <form onSubmit={handleSaveFirebaseConfig} className="admin-full-form">
                  <div className="form-group">
                    <label>Firebase API Key (apiKey)</label>
                    <input
                      type="text"
                      placeholder="e.g. AIzaSy..."
                      value={fbConfig.apiKey || ''}
                      onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Auth Domain (authDomain)</label>
                    <input
                      type="text"
                      value={fbConfig.authDomain || ''}
                      onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Project ID (projectId)</label>
                    <input
                      type="text"
                      value={fbConfig.projectId || ''}
                      onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Storage Bucket (storageBucket)</label>
                    <input
                      type="text"
                      value={fbConfig.storageBucket || ''}
                      onChange={(e) => setFbConfig({ ...fbConfig, storageBucket: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-accent" style={{ marginTop: '1rem', width: 'fit-content' }}>
                    <ShieldCheck size={16} /> Save & Connect Firebase Credentials
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .admin-page-root {
          min-height: 100vh;
          background-color: #F4F1EA;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          font-family: var(--font-body);
        }

        .admin-page-header {
          background-color: var(--text-primary);
          color: #FFFFFF;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--accent-gold);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-header-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .admin-brand-logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .admin-header-brand h1 {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          color: #FFFFFF;
          font-weight: 700;
          line-height: 1.1;
        }

        .admin-header-sub {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .admin-btn-action {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #E2DDD5;
          border-radius: var(--radius-sm);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .admin-btn-action:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: #FFF;
        }

        .admin-btn-action.danger {
          background-color: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #FCA5A5;
        }
        .admin-btn-action.danger:hover {
          background-color: #EF4444;
          color: #FFF;
        }

        .admin-btn-viewsite {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background-color: var(--accent-gold);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.785rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }
        .admin-btn-viewsite:hover {
          background-color: #FFFFFF;
        }

        .admin-page-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          flex-grow: 1;
        }
        @media (max-width: 900px) {
          .admin-page-layout {
            grid-template-columns: 1fr;
          }
        }

        .admin-sidebar {
          background-color: #FFFFFF;
          border-right: 1px solid var(--border-color);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-align: left;
          transition: var(--transition-smooth);
        }

        .sidebar-nav-item:hover {
          background-color: var(--bg-main);
          color: var(--text-primary);
        }

        .sidebar-nav-item.active {
          background-color: var(--text-primary);
          color: #FFFFFF;
          font-weight: 700;
        }

        .sidebar-footer-card {
          background-color: var(--bg-main);
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          margin-top: 2rem;
        }
        .card-store-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
        }
        .sidebar-footer-card p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.85rem;
        }
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #C62828;
          width: 100%;
        }

        .admin-main-content {
          padding: 2rem;
          overflow-y: auto;
        }

        .admin-card-panel {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .panel-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .panel-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .panel-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .orders-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .order-status-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .order-date-text {
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        .contact-detail-line {
          font-size: 0.785rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 2px;
        }
        .address-box-cell {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }
        .status-dropdown {
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.775rem;
          font-weight: 700;
          outline: none;
          border: 1px solid var(--border-color);
        }
        .status-new-lead { background-color: #FFEBEE; color: #C62828; }
        .status-confirmed { background-color: #FFF8E1; color: #F57F17; }
        .status-shipped { background-color: #E3F2FD; color: #1565C0; }
        .status-delivered { background-color: #E8F5E9; color: #2E7D32; }
        .status-cancelled { background-color: #ECEFF1; color: #37474F; }

        .wa-btn {
          color: #25D366 !important;
          border-color: #25D366 !important;
          text-decoration: none;
        }
        .wa-btn:hover {
          background-color: #25D366 !important;
          color: #FFF !important;
        }

        .cat-selector-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .cat-label {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .cat-pill {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        .cat-pill.active {
          background-color: var(--text-primary);
          color: #FFFFFF;
          border-color: var(--text-primary);
        }

        .subcat-admin-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .subcat-admin-label {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          text-transform: uppercase;
        }
        .subcat-admin-chip {
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        .subcat-admin-chip.active {
          background-color: var(--accent-gold-light);
          border-color: var(--accent-gold);
          color: var(--accent-gold-dark);
          font-weight: 700;
        }

        .admin-table-container {
          overflow-x: auto;
        }

        .admin-full-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-full-table th {
          text-align: left;
          padding: 0.85rem 1rem;
          background-color: var(--bg-main);
          color: var(--text-primary);
          font-weight: 700;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .admin-full-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          vertical-align: middle;
        }
        .table-product-thumb {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .table-product-title {
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .table-product-desc {
          font-size: 0.775rem;
          color: var(--text-secondary);
        }
        .table-price-cell {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
        }

        .row-action-btns {
          display: flex;
          gap: 0.5rem;
        }
        .action-icon {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--border-color);
          background-color: #FFFFFF;
        }
        .action-icon.edit:hover { background-color: var(--accent-gold-light); color: var(--accent-gold-dark); }
        .action-icon.delete:hover { background-color: #FFEBEE; color: #C62828; border-color: #FFCDD2; }

        .empty-table-cell {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }

        .admin-full-form {
          max-width: 800px;
        }
        .form-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-light);
        }
        .form-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { font-size: 0.8rem; font-weight: 700; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          font-family: var(--font-body);
          outline: none;
        }

        /* Admin Multi-Image Gallery Styling */
        .multi-img-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .multi-img-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .img-count-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-gold-dark);
          background-color: var(--accent-gold-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--accent-gold);
        }
        .form-hint-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .admin-photos-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .admin-photo-card {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }
        .admin-photo-card.is-primary {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 1px var(--accent-gold);
          background-color: #FFFDF9;
        }
        .admin-photo-preview-wrap {
          position: relative;
          height: 120px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #FFF;
          border: 1px solid var(--border-light);
        }
        .admin-photo-preview-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .primary-cover-badge {
          position: absolute;
          top: 0.35rem;
          left: 0.35rem;
          background: var(--text-primary);
          color: var(--accent-gold);
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        .photo-num-tag {
          position: absolute;
          bottom: 0.35rem;
          right: 0.35rem;
          background: rgba(0, 0, 0, 0.7);
          color: #FFF;
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }
        .admin-photo-actions {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .btn-photo-action {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.35rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          cursor: pointer;
        }
        .btn-photo-action:hover:not(:disabled) {
          background-color: var(--bg-main);
        }
        .btn-photo-action:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-photo-action.primary {
          background-color: var(--accent-gold);
          color: var(--text-primary);
          border-color: var(--accent-gold-dark);
          font-weight: 700;
        }
        .btn-photo-action.delete {
          color: #C62828;
          border-color: #FFCDD2;
        }
        .btn-photo-action.delete:hover {
          background-color: #FFEBEE;
        }
        .photo-order-btns {
          display: flex;
          gap: 0.25rem;
        }
        .photo-order-btns .btn-photo-action {
          flex: 1;
        }
        .add-img-subheading {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .max-photos-reached-banner {
          background-color: #DEF7EC;
          border: 1px solid #31C48D;
          color: #03543F;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          margin-top: 1rem;
        }

        .device-upload-container {
          border: 1px dashed var(--accent-gold);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background-color: var(--bg-main);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .drag-drop-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 1.25rem;
          background-color: #FFFFFF;
          border-radius: var(--radius-sm);
          border: 2px dashed var(--border-color);
          text-align: center;
        }
        .image-url-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .image-url-row input { flex-grow: 1; }
        .preview-image-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem;
          background: #FFFFFF;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .preview-image-box img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 4px;
        }

        .form-submit-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .homepage-photos-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        @media (min-width: 600px) {
          .homepage-photos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1050px) {
          .homepage-photos-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .homepage-photo-card {
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .homepage-photo-card h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .photo-preview {
          height: 160px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .photo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .full-w { width: 100%; text-align: center; justify-content: center; }

        .reviews-table-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .admin-review-card {
          background-color: var(--bg-main);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .rev-header { font-size: 0.95rem; margin-bottom: 0.25rem; }
        .rev-stars { color: #FFB800; margin-left: 0.5rem; }
        .rev-comment { font-size: 0.875rem; color: var(--text-secondary); font-style: italic; }
        .rev-date { font-size: 0.75rem; color: var(--text-muted); }
        @media (max-width: 768px) {
          .form-layout-grid {
            grid-template-columns: 1fr;
          }
          .admin-review-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .image-url-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

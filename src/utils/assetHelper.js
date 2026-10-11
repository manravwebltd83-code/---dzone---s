import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/config';

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
};

/**
 * Upload image file to Firebase Storage if available, else compress to Data URL
 */
export const uploadImageFileToStorage = async (file) => {
  if (!file) return '';
  if (storage) {
    try {
      const cleanFileName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'photo.jpg';
      const storageRef = ref(storage, `products/${Date.now()}_${cleanFileName}`);
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage upload timeout')), 12000)
      );

      const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (downloadURL) return downloadURL;
    } catch (err) {
      console.warn("Firebase Storage upload fallback to compressed image:", err);
    }
  }
  return await compressImageFile(file, 400, 0.45);
};

/**
 * Compress image file using HTML5 Canvas (resizes large photos & reduces quality to JPEG ~50KB)
 */
export const compressImageFile = (file, maxWidth = 400, quality = 0.55) => {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    if (file.type === 'image/svg+xml' || file.size < 40000) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const DEFAULT_FALLBACK_IMAGES = {
  WATCHES: '',
  BELTS: '',
  JEWELLERY: '',
  PERFUMES: '',
  DEFAULT: ''
};

export const isAdministratorUploadedImage = (img) => {
  if (!img || typeof img !== 'string') return false;
  const trimmed = img.trim();
  if (!trimmed) return false;
  // Strictly exclude demo, stock, sample, and automatic unsplash product images
  if (trimmed.includes('images.unsplash.com')) return false;
  if (trimmed.startsWith('data:')) {
    const parts = trimmed.split(',');
    if (parts.length < 2 || parts[1].length < 10) return false;
  }
  return true;
};

export const isValidImageSource = (img) => {
  return isAdministratorUploadedImage(img);
};

export const getProductImages = (product) => {
  if (!product) return [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    const valid = product.images.filter(isAdministratorUploadedImage);
    if (valid.length > 0) return valid;
  }
  if (isAdministratorUploadedImage(product.image)) {
    return [product.image];
  }
  return [];
};



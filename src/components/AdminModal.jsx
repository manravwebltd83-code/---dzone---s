import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, RotateCcw, Check, Download, Upload, ShieldCheck, Image, Star, Lock, Folder, Filter } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialProducts';
import { compressImageFile } from '../utils/assetHelper';

export default function AdminModal({
  products,
  homepageMedia,
  reviews,
  adminAuth,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdateHomepageMedia,
  onDeleteReview,
  onUpdateAdminAuth,
  onResetDefaults,
  onImportProducts,
  onClose
}) {
  const [adminTab, setAdminTab] = useState('products'); // 'products', 'homepage', 'reviews', 'security'
  const [productCategoryTab, setProductCategoryTab] = useState('WATCHES'); // WATCHES, BELTS, JEWELLERY, PERFUMES
  const [productSubcategoryTab, setProductSubcategoryTab] = useState('All');
  const [activeFormState, setActiveFormState] = useState('list'); // 'list', 'add', 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State for Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'WATCHES',
    subcategory: 'Premium Watches',
    price: '',
    inStock: true,
    image: '',
    shortDescription: ''
  });

  // Security Credentials Form State
  const [credUser, setCredUser] = useState(adminAuth?.username || 'dzone');
  const [credPass, setCredPass] = useState(adminAuth?.password || 'dzone123');

  const categories = ['WATCHES', 'BELTS', 'JEWELLERY', 'PERFUMES'];

  // Convert & Compress File to Data URL for Drag & Drop / Device picker
  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 800, 0.75);
      callback(compressed);
    } catch (err) {
      console.warn('Image compression error:', err);
    }
  };

  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      inStock: product.inStock,
      image: product.image,
      shortDescription: product.shortDescription
    });
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
      shortDescription: ''
    });
    setActiveFormState('add');
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in Product Name and Price.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    if (activeFormState === 'edit' && editingProductId) {
      onUpdateProduct(editingProductId, payload);
    } else {
      onAddProduct(payload);
    }

    setActiveFormState('list');
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

  // Security credentials save
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    onUpdateAdminAuth({ username: credUser, password: credPass });
    alert('Admin username and password updated successfully!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-title-wrap">
            <ShieldCheck size={24} className="text-gold" />
            <div>
              <h3>DZONE Store Admin Portal</h3>
              <p>Category & Subcategory Product Controls • Surat</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Main Admin Navigation Tabs */}
        <div className="admin-main-tabs">
          <button
            className={`main-tab-btn ${adminTab === 'products' ? 'active' : ''}`}
            onClick={() => { setAdminTab('products'); setActiveFormState('list'); }}
          >
            <Folder size={15} /> Category Products
          </button>
          <button
            className={`main-tab-btn ${adminTab === 'homepage' ? 'active' : ''}`}
            onClick={() => setAdminTab('homepage')}
          >
            <Image size={15} /> Homepage Banners & Photos
          </button>
          <button
            className={`main-tab-btn ${adminTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setAdminTab('reviews')}
          >
            <Star size={15} /> Customer Reviews ({reviews.length})
          </button>
          <button
            className={`main-tab-btn ${adminTab === 'security' ? 'active' : ''}`}
            onClick={() => setAdminTab('security')}
          >
            <Lock size={15} /> Login Password
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="admin-modal-body">
          {/* TAB 1: CATEGORY & SUBCATEGORY WISE PRODUCTS */}
          {adminTab === 'products' && (
            <div>
              {/* Category selector pills */}
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

                <button className="btn btn-primary add-prod-btn" onClick={handleStartAdd}>
                  <Plus size={15} /> Add {productCategoryTab} Product
                </button>
              </div>

              {/* Subcategory selector chips */}
              <div className="subcat-admin-bar">
                <span className="subcat-admin-label"><Filter size={13} /> Subcategory Filter:</span>
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
                <div className="admin-product-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Subcategory</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                            No products found under {productCategoryTab} &gt; {productSubcategoryTab}.<br />
                            Click "+ Add {productCategoryTab} Product" to add items into this subcategory.
                          </td>
                        </tr>
                      ) : (
                        categoryProducts.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <img src={p.image} alt={p.name} className="table-thumb" />
                            </td>
                            <td>
                              <strong className="table-p-name">{p.name}</strong>
                            </td>
                            <td>
                              <span className="table-subcat">{p.subcategory || '—'}</span>
                            </td>
                            <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                            <td>
                              <button
                                onClick={() => onToggleStock(p.id)}
                                className={`badge ${p.inStock ? 'badge-in-stock' : 'badge-out-stock'} toggle-stock-btn`}
                                title="Click to toggle Stock Status"
                              >
                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="icon-action-btn edit-icon"
                                  title="Edit Product"
                                >
                                  <Edit size={15} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete "${p.name}"?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="icon-action-btn delete-icon"
                                  title="Delete Product"
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
              )}

              {(activeFormState === 'add' || activeFormState === 'edit') && (
                <form onSubmit={handleProductSubmit} className="admin-form">
                  <h4 className="form-section-title">
                    {activeFormState === 'edit' ? `Edit "${formData.name}"` : `Add New Product in ${productCategoryTab}`}
                  </h4>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Diamond Skeleton Watch / Kadi Leather Belt / Gold Cuban Chain"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
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

                    {/* Image Selection with Device File Picker & Drag and Drop */}
                    <div className="form-group full-width">
                      <label>Product Photo (Device Picker / Drag & Drop / Image URL) *</label>
                      <div className="image-uploader-box">
                        <div
                          className="dropzone-area"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(e.dataTransfer.files[0], (base64) =>
                                setFormData({ ...formData, image: base64 })
                              );
                            }
                          }}
                        >
                          <Image size={24} className="text-gold" />
                          <p>Drag & Drop Photo Here OR</p>
                          <label className="btn btn-outline btn-sm file-choose-btn">
                            📁 Choose Photo from Device
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(e.target.files[0], (base64) =>
                                    setFormData({ ...formData, image: base64 })
                                  );
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>

                        <div className="url-fallback">
                          <span>Or enter Image URL:</span>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          />
                        </div>

                        {formData.image && (
                          <div className="image-preview-chip">
                            <img src={formData.image} alt="Preview" />
                            <span>Image Selected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Short Description</label>
                      <textarea
                        rows="3"
                        placeholder="Brief summary of product features or materials..."
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="form-group checkbox-group full-width">
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

                  <div className="form-buttons">
                    <button type="button" className="btn btn-outline" onClick={() => setActiveFormState('list')}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Check size={16} /> Save Product
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: HOMEPAGE BANNERS & PHOTOS CUSTOMIZER */}
          {adminTab === 'homepage' && (
            <div className="homepage-media-manager">
              <h4 className="form-section-title">Replace Homepage Banner & Category Photos</h4>
              <p className="media-mgr-desc">
                Select device files or drag-and-drop images to replace photos across the homepage.
              </p>

              <div className="media-cards-grid">
                {/* Hero Photo 1 */}
                <div className="media-card-item">
                  <h5>Hero Section Visual Photo 1 (Watches Card)</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.heroImage1} alt="Hero 1" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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
                <div className="media-card-item">
                  <h5>Hero Section Visual Photo 2 (Perfumes Card)</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.heroImage2} alt="Hero 2" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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

                {/* Category Photo WATCHES */}
                <div className="media-card-item">
                  <h5>WATCHES Main Category Card Banner</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.categoryImage_WATCHES} alt="Watches Category" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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

                {/* Category Photo BELTS */}
                <div className="media-card-item">
                  <h5>BELTS Main Category Card Banner</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.categoryImage_BELTS} alt="Belts Category" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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

                {/* Category Photo JEWELLERY */}
                <div className="media-card-item">
                  <h5>JEWELLERY Main Category Card Banner</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.categoryImage_JEWELLERY} alt="Jewellery Category" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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

                {/* Category Photo PERFUMES */}
                <div className="media-card-item">
                  <h5>PERFUMES Main Category Card Banner</h5>
                  <div className="media-preview-wrap">
                    <img src={homepageMedia.categoryImage_PERFUMES} alt="Perfumes Category" />
                  </div>
                  <label className="btn btn-outline btn-sm">
                    📁 Replace from Device
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

          {/* TAB 3: REVIEWS & FEEDBACK MANAGER */}
          {adminTab === 'reviews' && (
            <div>
              <h4 className="form-section-title">Manage Customer Feedback & Reviews</h4>
              <div className="reviews-admin-list">
                {reviews.map((rev) => (
                  <div key={rev.id} className="admin-review-row">
                    <div>
                      <strong>{rev.name}</strong> ({rev.location}) — <span className="text-gold">{'★'.repeat(rev.rating)}</span>
                      <p className="rev-comment-text">"{rev.comment}"</p>
                    </div>
                    <button
                      className="icon-action-btn delete-icon"
                      onClick={() => onDeleteReview(rev.id)}
                      title="Delete Review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY CREDENTIALS */}
          {adminTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="admin-form" style={{ maxWidth: 450 }}>
              <h4 className="form-section-title">Change Admin Username & Password</h4>

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

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <Check size={16} /> Save New Credentials
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .admin-modal-card {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 1000px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .admin-modal-header {
          padding: 1.25rem 1.5rem;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-title-wrap h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .admin-title-wrap p {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .admin-main-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
        }
        .main-tab-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          background-color: var(--bg-main);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: var(--transition-smooth);
        }
        .main-tab-btn.active {
          background-color: var(--text-primary);
          color: #FFFFFF;
          border-color: var(--text-primary);
        }

        .admin-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }

        .cat-selector-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.85rem;
        }
        .cat-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cat-pill {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.785rem;
          font-weight: 600;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        .cat-pill.active {
          background-color: var(--text-primary);
          border-color: var(--text-primary);
          color: #FFFFFF;
          font-weight: 700;
        }
        .add-prod-btn {
          margin-left: auto;
          padding: 0.45rem 0.95rem;
          font-size: 0.75rem;
        }

        .subcat-admin-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding: 0.65rem 0.85rem;
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .subcat-admin-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-transform: uppercase;
        }
        .subcat-admin-chip {
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.725rem;
          font-weight: 600;
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }
        .subcat-admin-chip.active {
          background-color: var(--accent-gold-light);
          border-color: var(--accent-gold);
          color: var(--accent-gold-dark);
          font-weight: 700;
        }

        .admin-product-table-wrap {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .admin-table th {
          text-align: left;
          padding: 0.75rem 0.85rem;
          background-color: var(--bg-main);
          color: var(--text-primary);
          font-weight: 700;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .admin-table td {
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid var(--border-light);
          vertical-align: middle;
        }
        .table-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .toggle-stock-btn {
          cursor: pointer;
          border: none;
        }
        .row-actions {
          display: flex;
          gap: 0.5rem;
        }
        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          background: #FFF;
        }
        .edit-icon:hover { background-color: var(--accent-gold-light); color: var(--accent-gold-dark); }
        .delete-icon:hover { background-color: #FFEBEE; color: #C62828; }

        .image-uploader-box {
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background-color: var(--bg-main);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .dropzone-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px dashed var(--accent-gold);
          border-radius: var(--radius-sm);
          background-color: #FFFFFF;
          text-align: center;
        }
        .file-choose-btn {
          cursor: pointer;
          padding: 0.4rem 0.85rem;
          font-size: 0.75rem;
        }
        .url-fallback {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.785rem;
        }
        .url-fallback input {
          flex-grow: 1;
        }
        .image-preview-chip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem;
          background: #FFFFFF;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .image-preview-chip img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }

        .media-cards-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 600px) {
          .media-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .media-card-item {
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .media-card-item h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .media-preview-wrap {
          height: 140px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .media-preview-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-review-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem;
          border-bottom: 1px solid var(--border-light);
        }
        .rev-comment-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .admin-form {
          max-width: 700px;
        }
        .form-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { font-size: 0.785rem; font-weight: 700; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-family: var(--font-body);
          font-size: 0.85rem;
          outline: none;
        }
        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
}

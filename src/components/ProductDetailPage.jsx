import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X
} from 'lucide-react';
import { getProductImages } from '../utils/assetHelper';

export default function ProductDetailPage({ product, onBack, onBuyNow, onSelectProduct, allProducts = [] }) {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    setActiveIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Keyboard controls for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeIndex, images.length]);

  if (!product) return null;

  const currentImage = images[activeIndex] || images[0];

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  const whatsappMessage = `Hello DZONE COLLECTION Surat, I am interested in ${product.name} (Price: ₹${Number(product.price).toLocaleString('en-IN')}). Please share availability and dispatch details!`;
  const whatsappUrl = `https://wa.me/919624165548?text=${encodeURIComponent(whatsappMessage)}`;

  // Find related products in the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page-root animate-fade-in-up">
      {/* Top Navigation Bar */}
      <div className="detail-top-bar">
        <div className="container detail-bar-flex">
          <button onClick={onBack} className="btn-back-catalogue">
            <ArrowLeft size={18} /> BACK TO CATALOGUE
          </button>

          <div className="detail-breadcrumbs">
            <span>HOME</span>
            <span className="crumb-sep">/</span>
            <span>{product.category}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container detail-main-container">
        {/* Main 2-Column Showcase */}
        <div className="product-showcase-grid">
          {/* Left Column: Multi-Image Product Gallery & Badges */}
          <div className="showcase-image-col">
            <div
              className="main-image-card"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <span className="badge badge-gold category-float-badge">{product.category}</span>
              {product.subcategory && (
                <span className="subcategory-float-badge">{product.subcategory}</span>
              )}

              {/* Main Active Image */}
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.name} - Image ${activeIndex + 1}`}
                  className="product-main-img"
                  onClick={() => setLightboxOpen(true)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="empty-photo-placeholder" style={{ width: '100%', height: 360, backgroundColor: '#f1f5f9', borderRadius: 12 }}></div>
              )}

              {/* Zoom Lightbox Hint */}
              {currentImage && (
                <button
                  type="button"
                  className="gallery-zoom-trigger"
                  onClick={() => setLightboxOpen(true)}
                  title="Click to view full screen lightbox"
                >
                  <ZoomIn size={14} /> Tap to Enlarge
                </button>
              )}

              {/* Gallery Counter Pill */}
              {images.length > 1 && (
                <div className="gallery-counter-chip">
                  {activeIndex + 1} / {images.length}
                </div>
              )}

              {/* Prev & Next Arrows Overlay */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-arrow-btn prev-arrow"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="gallery-arrow-btn next-arrow"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Clickable Thumbnails Row */}
            {images.length > 1 && (
              <div className="gallery-thumbnails-wrapper">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-thumb-item ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="guarantee-pills-row">
              <div className="guarantee-pill">
                <ShieldCheck size={16} className="pill-icon" /> 100% Genuine Quality
              </div>
              <div className="guarantee-pill">
                <Truck size={16} className="pill-icon" /> Express Prepaid Dispatch
              </div>
              <div className="guarantee-pill">
                <RefreshCw size={16} className="pill-icon" /> Store Exchange Warranty
              </div>
            </div>
          </div>

          {/* Right Column: Title, Specs & Buy Actions */}
          <div className="showcase-info-col">
            <div className="info-meta-tags">
              <span className="badge badge-gold">{product.category}</span>
              {product.subcategory && (
                <span className="meta-subcat-chip">{product.subcategory}</span>
              )}
            </div>

            <h1 className="detail-product-title">{product.name}</h1>

            <div className="detail-price-row">
              <div className="detail-price">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
              <div className={`stock-status-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                {product.inStock ? (
                  <><CheckCircle2 size={14} /> Available at Surat Store</>
                ) : (
                  <><XCircle size={14} /> Out of Stock</>
                )}
              </div>
            </div>

            <div className="detail-divider"></div>

            <div className="detail-desc-box">
              <h3 className="desc-heading">Product Overview</h3>
              <p className="desc-text">{product.shortDescription}</p>
            </div>

            {/* Key Features & Specifications Table */}
            <div className="specs-card">
              <h4 className="specs-heading">Item Specifications</h4>
              <div className="specs-table">
                <div className="spec-row">
                  <span className="spec-label">Category:</span>
                  <span className="spec-val"><strong>{product.category}</strong></span>
                </div>
                {product.subcategory && (
                  <div className="spec-row">
                    <span className="spec-label">Subcategory / Type:</span>
                    <span className="spec-val">{product.subcategory}</span>
                  </div>
                )}
                <div className="spec-row">
                  <span className="spec-label">Store Location:</span>
                  <span className="spec-val">Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Delivery Mode:</span>
                  <span className="spec-val" style={{ color: '#03543F', fontWeight: 700 }}>
                    ⚡ Prepaid Online UPI Scanner (BharatPe)
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="detail-actions-box">
              <button
                onClick={() => onBuyNow(product)}
                className="btn btn-primary detail-buy-now-btn"
              >
                <ShoppingBag size={18} /> BUY NOW - DIRECT CHECKOUT
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp detail-wa-btn"
              >
                <MessageCircle size={18} /> ENQUIRE ON WHATSAPP
              </a>
            </div>

            <div className="store-address-notice">
              <MapPin size={16} className="pin-icon" />
              <span>
                <strong>Dzone Collection</strong> • Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013, India (Tel: +91 96241 65548)
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    'Dzone Collection, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', color: 'var(--accent-gold-dark)', fontWeight: 700, marginTop: '0.25rem' }}
                >
                  📍 View on Google Maps / Get Directions →
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="related-header">
              <span className="section-subtitle">RECOMMENDED FOR YOU</span>
              <h3 className="related-title">MORE FROM {product.category}</h3>
              <div className="gold-divider"></div>
            </div>

            <div className="related-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="related-product-card"
                  onClick={() => onSelectProduct(rel)}
                >
                  <img src={rel.image} alt={rel.name} />
                  <div className="related-card-body">
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{rel.category}</span>
                    <h4 className="related-name">{rel.name}</h4>
                    <div className="related-price">₹{Number(rel.price).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            <div
              className="lightbox-main-stage"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={currentImage}
                alt={`${product.name} - Enlarge view ${activeIndex + 1}`}
                className="lightbox-img"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-nav-btn prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav-btn next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            <div className="lightbox-footer">
              <span className="lightbox-counter">
                {product.name} ({activeIndex + 1} / {images.length})
              </span>
              {images.length > 1 && (
                <div className="lightbox-thumbs">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`lightbox-thumb ${idx === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .product-detail-page-root {
          min-height: 100vh;
          background-color: var(--bg-main);
          padding-bottom: 7rem;
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Multi-Image Gallery Styling */
        .gallery-zoom-trigger {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          backdrop-filter: blur(4px);
          z-index: 5;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition-smooth);
        }
        .gallery-zoom-trigger:hover {
          background: var(--text-primary);
          color: var(--accent-gold);
        }

        .gallery-counter-chip {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
          z-index: 5;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gallery-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 6;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }
        .gallery-arrow-btn:hover {
          background: var(--text-primary);
          color: var(--accent-gold);
        }
        .gallery-arrow-btn.prev-arrow { left: 0.65rem; }
        .gallery-arrow-btn.next-arrow { right: 0.65rem; }

        .gallery-thumbnails-wrapper {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding: 0.3rem 0.1rem;
          scrollbar-width: thin;
          max-width: 100%;
        }
        .gallery-thumb-item {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: var(--radius-sm);
          border: 2px solid var(--border-color);
          overflow: hidden;
          background: #FFFFFF;
          padding: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gallery-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
        .gallery-thumb-item.active {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 2px var(--accent-gold-light);
          transform: scale(1.04);
        }

        /* LIGHTBOX STYLING */
        .lightbox-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        .lightbox-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .lightbox-close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s ease;
        }
        .lightbox-close-btn:hover {
          background: #FFFFFF;
          color: #000;
        }
        .lightbox-main-stage {
          position: relative;
          flex-grow: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 72vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
        }
        .lightbox-nav-btn:hover {
          background: #FFFFFF;
          color: #000000;
        }
        .lightbox-nav-btn.prev { left: 1rem; }
        .lightbox-nav-btn.next { right: 1rem; }

        .lightbox-footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }
        .lightbox-counter {
          color: #E2E8F0;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
        }
        .lightbox-thumbs {
          display: flex;
          gap: 0.5rem;
        }
        .lightbox-thumb {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          border: 2px solid transparent;
          overflow: hidden;
          opacity: 0.6;
          transition: all 0.2s ease;
        }
        .lightbox-thumb img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .lightbox-thumb.active {
          border-color: var(--accent-gold);
          opacity: 1;
        }

        .detail-top-bar {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          padding: 0.85rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }

        .detail-bar-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .btn-back-catalogue {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--text-primary);
          color: #FFFFFF;
          font-size: 0.785rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 0.55rem 1.1rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }
        .btn-back-catalogue:hover {
          background-color: var(--accent-gold);
          color: var(--text-primary);
        }

        .detail-breadcrumbs {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
          flex-wrap: wrap;
        }
        .crumb-sep { color: var(--text-muted); }
        .crumb-active { color: var(--accent-gold-dark); font-weight: 700; }

        .detail-main-container {
          margin-top: 1.5rem;
          padding: 0 0.5rem;
        }

        .product-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          box-shadow: var(--shadow-md);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .product-showcase-grid {
            grid-template-columns: 1.1fr 1.25fr;
            padding: 3rem;
            gap: 2.5rem;
          }
        }

        /* Left Image Showcase */
        .showcase-image-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .main-image-card {
          position: relative;
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          aspect-ratio: 1 / 1;
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .category-float-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          z-index: 2;
        }
        .subcategory-float-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          z-index: 2;
          background: rgba(28, 28, 28, 0.85);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
        }

        .product-main-img {
          width: 100%;
          max-width: 100%;
          height: 100%;
          max-height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          cursor: pointer;
          display: block;
        }
        .main-image-card:hover .product-main-img {
          transform: scale(1.03);
        }

        .guarantee-pills-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .guarantee-pill {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          word-break: break-word;
        }
        .pill-icon {
          color: var(--accent-gold-dark);
          flex-shrink: 0;
        }

        /* Right Info Column */
        .showcase-info-col {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .info-meta-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .meta-subcat-chip {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          background-color: var(--bg-main);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .detail-product-title {
          font-family: var(--font-heading);
          font-size: clamp(1.35rem, 5.5vw, 2.5rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .detail-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .detail-price {
          font-family: var(--font-heading);
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          font-weight: 700;
          color: var(--accent-gold-dark);
        }

        .stock-status-badge {
          font-size: 0.775rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .stock-status-badge.in-stock {
          background-color: #DEF7EC;
          color: #03543F;
        }
        .stock-status-badge.out-stock {
          background-color: #FDE8E8;
          color: #9B1C1C;
        }

        .detail-divider {
          height: 1px;
          background-color: var(--border-color);
        }

        .detail-desc-box {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .desc-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
        }
        .desc-text {
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.6;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        /* Specifications Card */
        .specs-card {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1rem;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .specs-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid var(--border-color);
        }
        .specs-table {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          gap: 0.5rem;
        }
        .spec-label {
          color: var(--text-secondary);
          width: 38%;
          flex-shrink: 0;
        }
        .spec-val {
          color: var(--text-primary);
          width: 60%;
          text-align: right;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        @media (max-width: 650px) {
          .spec-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.15rem;
            border-bottom: 1px dashed var(--border-color);
            padding-bottom: 0.4rem;
          }
          .spec-label {
            width: 100%;
            font-weight: 700;
            font-size: 0.75rem;
          }
          .spec-val {
            width: 100%;
            text-align: left;
            font-size: 0.825rem;
          }
        }

        /* Action Buttons Box */
        .detail-actions-box {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 650px) {
          .detail-actions-box {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .detail-buy-now-btn {
          flex: 1 1 0%;
          min-width: 0;
          padding: 0.85rem 0.5rem;
          font-size: 0.825rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          white-space: normal;
          text-align: center;
          box-sizing: border-box;
        }
        .detail-wa-btn {
          flex: 1 1 0%;
          min-width: 0;
          padding: 0.85rem 0.5rem;
          font-size: 0.825rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          white-space: normal;
          text-align: center;
          box-sizing: border-box;
        }

        @media (max-width: 650px) {
          .detail-buy-now-btn, .detail-wa-btn {
            width: 100%;
            padding: 0.85rem 1rem;
            font-size: 0.85rem;
          }
        }

        .store-address-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
          word-break: break-word;
          overflow-wrap: break-word;
          width: 100%;
          box-sizing: border-box;
        }
        .pin-icon {
          color: var(--accent-gold-dark);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Related Products */
        .related-products-section {
          margin-top: 3.5rem;
        }
        .related-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .related-title {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 0.25rem;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .related-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        .related-product-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .related-product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-gold);
        }
        .related-product-card img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }
        .related-card-body {
          padding: 0.75rem;
        }
        .related-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0.25rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .related-price {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-gold-dark);
        }
      `}</style>
    </div>
  );
}

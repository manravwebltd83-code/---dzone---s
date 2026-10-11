import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle2, XCircle, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductImages } from '../utils/assetHelper';

export default function ProductModal({ product, onClose, onBuyNow }) {
  const images = getProductImages(product);
  const [activeIdx, setActiveIdx] = useState(0);

  if (!product) return null;

  const currentImage = images[activeIdx] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const whatsappMessage = `Hello DZONE COLLECTION, I am interested in ${product.name}. Please share details and availability.`;
  const whatsappUrl = `https://wa.me/919624165548?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          <div className="modal-image-col">
            <div className="modal-img-stage">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="empty-photo-placeholder" style={{ width: '100%', height: 260, backgroundColor: '#f1f5f9', borderRadius: 8 }}></div>
              )}
              {images.length > 1 && (
                <>
                  <button type="button" className="m-arrow prev" onClick={handlePrev}>
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" className="m-arrow next" onClick={handleNext}>
                    <ChevronRight size={20} />
                  </button>
                  <span className="m-count-tag">{activeIdx + 1} / {images.length}</span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="modal-thumbs-row">
                {images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`m-thumb ${i === activeIdx ? 'active' : ''}`}
                    onClick={() => setActiveIdx(i)}
                  >
                    <img
                      src={url}
                      alt={`Thumb ${i + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="modal-info-col">
            <div className="modal-meta-row">
              <span className="badge badge-gold">{product.category}</span>
              {product.subcategory && (
                <span className="modal-subcat-badge">{product.subcategory}</span>
              )}
            </div>

            <h2 className="modal-product-title">{product.name}</h2>

            <div className="modal-price-row">
              <span className="modal-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
              <span className={`badge ${product.inStock ? 'badge-in-stock' : 'badge-out-stock'}`}>
                {product.inStock ? (
                  <><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} /> Available in Store</>
                ) : (
                  <><XCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> Currently Out of Stock</>
                )}
              </span>
            </div>

            <div className="modal-divider"></div>

            <div className="modal-description-box">
              <span className="modal-section-label">DESCRIPTION</span>
              <p className="modal-description-text">{product.shortDescription}</p>
            </div>

            <div className="modal-store-info">
              <span className="store-note">
                📍 Store Address: <strong>Dzone Collection</strong>, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013, India
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

            <div className="modal-actions-row">
              <button
                onClick={() => {
                  onClose();
                  onBuyNow(product);
                }}
                className="btn btn-primary modal-buy-btn"
              >
                <ShoppingBag size={18} /> BUY NOW
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp modal-wa-btn"
              >
                <MessageCircle size={18} /> ENQUIRE ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-modal-card {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 820px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          animation: slideUp 0.25s ease-out;
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }
        .modal-close-btn:hover {
          background-color: var(--text-primary);
          color: #FFFFFF;
        }

        .product-modal-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 650px) {
          .product-modal-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .modal-image-col {
          background-color: #F8F6F0;
          display: flex;
          flex-direction: column;
        }
        .modal-img-stage {
          position: relative;
          flex-grow: 1;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        @media (min-width: 650px) {
          .modal-img-stage {
            height: 340px;
          }
        }
        .modal-img-stage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .m-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          z-index: 5;
        }
        .m-arrow.prev { left: 0.5rem; }
        .m-arrow.next { right: 0.5rem; }
        .m-count-tag {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          background: rgba(15, 23, 42, 0.8);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
        }
        .modal-thumbs-row {
          display: flex;
          gap: 0.4rem;
          padding: 0.6rem;
          background: #EFEBE0;
          overflow-x: auto;
          justify-content: center;
        }
        .m-thumb {
          width: 46px;
          height: 46px;
          border-radius: 4px;
          border: 2px solid transparent;
          overflow: hidden;
          flex-shrink: 0;
        }
        .m-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .m-thumb.active {
          border-color: var(--accent-gold);
        }

        .modal-info-col {
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
        }

        .modal-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .modal-subcat-badge {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .modal-product-title {
          font-size: 1.85rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .modal-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .modal-price {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-gold-dark);
        }

        .modal-divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 0.75rem 0 1.25rem;
        }

        .modal-description-box {
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        .modal-section-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-gold-dark);
          display: block;
          margin-bottom: 0.35rem;
        }
        .modal-description-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .modal-store-info {
          background-color: var(--bg-main);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-light);
        }
        .store-note {
          font-size: 0.775rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .modal-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .modal-buy-btn, .modal-wa-btn {
          padding: 0.85rem 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          white-space: normal;
          text-align: center;
        }
        @media (max-width: 550px) {
          .product-modal-card {
            width: 100%;
            max-width: 100%;
            margin: 0;
            max-height: 92dvh;
            border-radius: var(--radius-sm);
          }
          .modal-image-col {
            height: clamp(200px, 55vw, 280px);
          }
          .modal-info-col {
            padding: 1.25rem 1rem;
          }
          .modal-product-title {
            font-size: 1.35rem;
          }
          .modal-price {
            font-size: 1.4rem;
          }
          .modal-actions-row {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }
          .modal-buy-btn, .modal-wa-btn {
            width: 100%;
            font-size: 0.825rem;
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

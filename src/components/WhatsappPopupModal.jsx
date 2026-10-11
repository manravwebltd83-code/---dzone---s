import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function WhatsappPopupModal({ onClose, defaultProduct = '' }) {
  const [userName, setUserName] = useState('');
  const [userQuery, setUserQuery] = useState(
    defaultProduct
      ? `Hello DZONE COLLECTION, I am interested in ${defaultProduct}. Please share details and availability.`
      : 'Hello DZONE COLLECTION, I am looking for watches/belts/jewellery/perfumes. Please guide me.'
  );

  const handleSend = (e) => {
    e.preventDefault();
    const formattedText = userName
      ? `Hello DZONE COLLECTION, my name is ${userName}. ${userQuery}`
      : userQuery;
    const url = `https://wa.me/919624165548?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="wa-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="wa-popup-header">
          <div className="wa-header-icon">
            <MessageCircle size={28} />
          </div>
          <div>
            <h3>DZONE COLLECTION</h3>
            <p>Direct WhatsApp Store Enquiry • +91 96241 65548</p>
          </div>
        </div>

        <form onSubmit={handleSend} className="wa-popup-body">
          <div className="wa-input-group">
            <label>Your Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Rahul Patel"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="wa-input-group">
            <label>Your Message / Enquiry</label>
            <textarea
              rows="3"
              required
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            ></textarea>
          </div>

          <div className="wa-quick-chips">
            <span className="chip-title">Quick Enquiries:</span>
            <button
              type="button"
              className="quick-chip"
              onClick={() => setUserQuery("Hello DZONE COLLECTION, I want to see the latest Premium Watches collection.")}
            >
              ⌚ Watches
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => setUserQuery("Hello DZONE COLLECTION, please share Leather Belts price & photos.")}
            >
              👔 Belts
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => setUserQuery("Hello DZONE COLLECTION, I am interested in brass/steel Jewellery & Kada.")}
            >
              ✨ Jewellery
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => setUserQuery("Hello DZONE COLLECTION, please share Perfumes & Body Sprays options.")}
            >
              🧪 Perfumes
            </button>
          </div>

          <button type="submit" className="btn btn-whatsapp wa-send-btn">
            <Send size={16} /> Open in WhatsApp
          </button>
        </form>

        <div className="wa-popup-footer">
          <span><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} /> Instant response from store staff in Surat</span>
        </div>
      </div>

      <style>{`
        .wa-popup-card {
          background: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          position: relative;
          animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .wa-popup-header {
          background-color: #25D366;
          color: #FFFFFF;
          padding: 1.5rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .wa-header-icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-popup-header h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.15rem;
        }

        .wa-popup-header p {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .wa-popup-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .wa-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .wa-input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .wa-input-group input, .wa-input-group textarea {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-family: var(--font-body);
          font-size: 0.85rem;
          outline: none;
        }

        .wa-input-group input:focus, .wa-input-group textarea:focus {
          border-color: #25D366;
        }

        .wa-quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }

        .chip-title {
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
          width: 100%;
        }

        .quick-chip {
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.725rem;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }

        .quick-chip:hover {
          border-color: #25D366;
          color: #25D366;
        }

        .wa-send-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .wa-popup-footer {
          padding: 0.65rem 1.25rem;
          background-color: var(--bg-main);
          border-top: 1px solid var(--border-light);
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

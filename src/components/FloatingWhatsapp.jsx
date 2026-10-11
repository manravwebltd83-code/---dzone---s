import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsapp() {
  const whatsappUrl = "https://wa.me/919624165548?text=Hello%20DZONE%20COLLECTION%2C%20I%20have%20an%20enquiry%20regarding%20your%20collection.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="floating-wa-btn"
      aria-label="Enquire on WhatsApp"
      title="Enquire on WhatsApp (+91 96241 65548)"
    >
      <MessageCircle size={28} />
      <span className="wa-tooltip">WhatsApp Us</span>

      <style>{`
        .floating-wa-btn {
          position: fixed;
          bottom: 1.75rem;
          right: 1.75rem;
          z-index: 99;
          width: 58px;
          height: 58px;
          background-color: #25D366;
          color: #FFFFFF;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
        }

        .floating-wa-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.55);
        }

        .wa-tooltip {
          position: absolute;
          right: 68px;
          background-color: #1C1C1C;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          box-shadow: var(--shadow-md);
        }

        .floating-wa-btn:hover .wa-tooltip {
          opacity: 1;
        }
      `}</style>
    </a>
  );
}

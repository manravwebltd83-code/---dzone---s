import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Mail } from 'lucide-react';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactSection() {
  const phone = "96241 65548";
  const rawPhone = "+919624165548";
  const instagram = "@DZONE_COLLECTION";
  const email = "dzone6226@gmail.com";
  const instagramUrl = "https://instagram.com/DZONE_COLLECTION";
  const whatsappUrl = "https://wa.me/919624165548?text=Hello%20DZONE%20COLLECTION%2C%20I%20would%20like%20to%20get%20in%20touch.";
  const mapsSearchQuery = "Dzone Collection, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`;

  return (
    <section id="contact-section" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <span className="section-subtitle">GET IN TOUCH</span>
          <h2 className="section-title">CONTACT US</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="contact-card-grid">
          {/* Contact Information */}
          <div className="contact-info-card">
            <h3 className="contact-brand-title">Dzone Collection</h3>
            <span className="contact-tagline">Surat's Premium Accessories Destination</span>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <strong className="info-label">Store Location</strong>
                  <p>
                    Dzone Collection,<br />
                    Royal Arcade, G-23,<br />
                    Marutidham Society,<br />
                    Sarthana Jakat Naka,<br />
                    Mani Nagar Society,<br />
                    Nana Varachha,<br />
                    Surat, Gujarat 395013, India
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-text">
                  <strong className="info-label">Call / WhatsApp</strong>
                  <p>{phone}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-text">
                  <strong className="info-label">Email Support</strong>
                  <p><a href={`mailto:${email}`} className="email-link-text">{email}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <InstagramIcon size={20} />
                </div>
                <div className="info-text">
                  <strong className="info-label">Instagram Profile</strong>
                  <p><a href={instagramUrl} target="_blank" rel="noreferrer" className="insta-link-text">{instagram}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={20} />
                </div>
                <div className="info-text">
                  <strong className="info-label">Store Timing</strong>
                  <p>10:00 AM – 9:30 PM (Open Daily)</p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="contact-action-buttons">
              <a href={`tel:${rawPhone}`} className="btn btn-primary contact-btn">
                <Phone size={16} /> CALL
              </a>

              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp contact-btn">
                <MessageCircle size={16} /> WHATSAPP
              </a>

              <a href={instagramUrl} target="_blank" rel="noreferrer" className="btn btn-outline contact-btn">
                <InstagramIcon size={16} /> INSTAGRAM
              </a>

              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-accent contact-btn">
                <Navigation size={16} /> GET DIRECTIONS
              </a>
            </div>
          </div>

          {/* Quick Location Box */}
          <div className="location-box">
            <div className="map-placeholder">
              <div className="map-icon-wrap">
                <MapPin size={36} className="text-gold" />
              </div>
              <h4>Dzone Collection</h4>
              <p>
                Royal Arcade, G-23,<br />
                Marutidham Society, Sarthana Jakat Naka,<br />
                Mani Nagar Society, Nana Varachha,<br />
                Surat, Gujarat 395013, India
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                ✉ Email: <strong>{email}</strong>
              </p>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                <Navigation size={14} /> View on Google Maps / Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 4rem 0;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-light);
        }
        .contact-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .contact-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 850px) {
          .contact-card-grid {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }
        .contact-info-card {
          background-color: #FFFFFF;
          padding: 2.5rem 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .contact-brand-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .contact-tagline {
          font-size: 0.85rem;
          color: var(--accent-gold-dark);
          font-weight: 600;
          display: block;
          margin-bottom: 1.75rem;
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .info-icon {
          width: 38px;
          height: 38px;
          background-color: var(--bg-main);
          color: var(--accent-gold-dark);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-text p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .info-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.15rem;
        }
        .email-link-text, .insta-link-text {
          color: var(--text-primary);
          font-weight: 600;
          text-decoration: underline;
        }
        .email-link-text:hover, .insta-link-text:hover {
          color: var(--accent-gold);
        }
        .contact-action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 480px) {
          .contact-action-buttons {
            grid-template-columns: 1fr;
          }
        }
        .contact-btn {
          font-size: 0.75rem;
          padding: 0.75rem 0.5rem;
        }
        .location-box {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .map-placeholder {
          text-align: center;
          max-width: 360px;
        }
        .map-icon-wrap {
          width: 64px;
          height: 64px;
          background-color: var(--accent-gold-light);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          border: 1px solid var(--border-color);
        }
        .map-placeholder h4 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .map-placeholder p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }
        .btn-sm {
          padding: 0.6rem 1.2rem;
          font-size: 0.785rem;
        }
      `}</style>
    </section>
  );
}

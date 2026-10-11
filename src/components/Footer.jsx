import React from 'react';
import { getAssetUrl } from '../utils/assetHelper';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={getAssetUrl('dzone_logo.png')} alt="DZONE Collection" className="footer-logo-img" />
              <span className="brand-name">DZONE COLLECTION</span>
            </div>
            <p className="footer-tagline">
              Surat's destination for luxury watches, leather belts, fine jewellery, and premium perfumes.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">CATEGORIES</h4>
            <div className="footer-cat-list">
              <button onClick={() => onSelectCategory('WATCHES')}>Watches</button>
              <span className="dot">•</span>
              <button onClick={() => onSelectCategory('BELTS')}>Belts</button>
              <span className="dot">•</span>
              <button onClick={() => onSelectCategory('JEWELLERY')}>Jewellery</button>
              <span className="dot">•</span>
              <button onClick={() => onSelectCategory('PERFUMES')}>Perfumes</button>
            </div>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">STORE LOCATION</h4>
            <p className="address-text">
              Dzone Collection,<br />
              Royal Arcade, G-23,<br />
              Marutidham Society,<br />
              Sarthana Jakat Naka,<br />
              Mani Nagar Society,<br />
              Nana Varachha,<br />
              Surat, Gujarat 395013, India
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                'Dzone Collection, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="footer-maps-link"
            >
              📍 View on Google Maps / Get Directions
            </a>
            <p className="phone-text" style={{ marginTop: '0.75rem' }}>Calling / WhatsApp: <strong>96241 65548</strong></p>
            <p className="insta-text">Email: <strong>dzone6226@gmail.com</strong></p>
            <p className="insta-text">Instagram: <strong>@DZONE_COLLECTION</strong></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© DZONE COLLECTION. All rights reserved.</p>
          <p className="developer-credit">
            Designed by <span className="dev-name">MANRAV WEB DEVELOPERS</span>
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--text-primary);
          color: #E2DDD5;
          padding: 3.5rem 0 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 768px) {
          .footer-top {
            grid-template-columns: 1.2fr 1fr 1.2fr;
          }
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }
        .footer-logo-img {
          height: 40px;
          width: auto;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }
        .footer-logo .brand-name {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 0.05em;
        }
        .footer-tagline {
          font-size: 0.85rem;
          color: #B0A99E;
          line-height: 1.5;
        }
        .footer-heading {
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .footer-cat-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-cat-list button {
          color: #E2DDD5;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        .footer-cat-list button:hover {
          color: var(--accent-gold);
        }
        .dot {
          color: #777;
          font-size: 0.8rem;
        }
        .address-text, .phone-text, .insta-text {
          font-size: 0.85rem;
          color: #C2BBB0;
          line-height: 1.5;
          margin-bottom: 0.4rem;
        }
        .footer-maps-link {
          display: inline-block;
          color: var(--accent-gold);
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 0.4rem;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .footer-maps-link:hover {
          color: #FFFFFF;
        }
        .phone-text strong, .insta-text strong {
          color: #FFFFFF;
        }
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1.5rem;
          font-size: 0.8rem;
          color: #999388;
        }
        @media (min-width: 600px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .developer-credit {
          font-size: 0.8rem;
          color: #999388;
        }
        .developer-credit .dev-name {
          color: var(--accent-gold);
          font-weight: 700;
          letter-spacing: 0.06em;
        }
      `}</style>
    </footer>
  );
}

import React, { useState } from 'react';
import { Menu, X, Mail, MessageCircle, Sun, Moon } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'HOME', id: 'HOME' },
    { label: 'WATCHES', id: 'WATCHES' },
    { label: 'BELTS', id: 'BELTS' },
    { label: 'JEWELLERY', id: 'JEWELLERY' },
    { label: 'PERFUMES', id: 'PERFUMES' },
    { label: 'REVIEWS', id: 'REVIEWS' },
    { label: 'CONTACT', id: 'CONTACT' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    if (id === 'HOME') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'CONTACT') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'REVIEWS') {
      const el = document.getElementById('reviews-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-header">
      {/* Top Banner Notice */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-location">
            <span>📍 Dzone Collection, Royal Arcade, G-23, Sarthana Jakat Naka, Surat 395013</span>
          </div>

          <div className="top-social-contacts">
            <span>📞 Call / WhatsApp: <strong>96241 65548</strong></span>
            <span className="top-dot">•</span>
            <span>✉ <strong>dzone6226@gmail.com</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header Line */}
      <div className="main-nav-container">
        <div className="container main-nav">
          {/* Highlighted & Attractive DZONE Branding Section */}
          <div className="logo-brand" onClick={() => handleNavClick('HOME')} title="DZONE COLLECTION - Home">
            <div className="logo-glowing-wrapper">
              <img src={getAssetUrl('dzone_logo.png')} alt="DZONE COLLECTION Logo" className="header-brand-logo-img" />
            </div>
            <div className="logo-text">
              <div className="brand-title-row">
                <span className="brand-dzone-highlighted">DZONE</span>
                <span className="brand-collection-badge">COLLECTION</span>
              </div>
              <span className="brand-sub">📍 SURAT • ROYAL ARCADE</span>
            </div>
          </div>

          {/* Navigation Links + Inline Contact Icons */}
          <div className="nav-and-icons-group">
            <nav className="desktop-menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Icons in this exact navigation line */}
            <div className="inline-header-icons">
              {/* Dark / Light Mode Switcher Button */}
              <button
                onClick={onToggleTheme}
                className="header-icon-btn theme-toggle-btn"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme Mode"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="sun-icon" />
                ) : (
                  <Moon size={18} className="moon-icon" />
                )}
              </button>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/919624165548"
                target="_blank"
                rel="noreferrer"
                className="header-icon-btn nav-wa"
                title="WhatsApp Enquiry (96241 65548)"
              >
                <MessageCircle size={18} />
              </a>

              {/* Gmail Icon */}
              <a
                href="mailto:dzone6226@gmail.com"
                className="header-icon-btn nav-mail"
                title="Email Us (dzone6226@gmail.com)"
              >
                <Mail size={18} />
              </a>

              {/* Instagram Icon */}
              <a
                href="https://instagram.com/DZONE_COLLECTION"
                target="_blank"
                rel="noreferrer"
                className="header-icon-btn nav-insta"
                title="Instagram (@DZONE_COLLECTION)"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="nav-actions">
            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-menu-links">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mobile-social-bar">
            <a href="https://wa.me/919624165548" target="_blank" rel="noreferrer" className="mobile-social-item wa">
              <MessageCircle size={16} /> WhatsApp: 96241 65548
            </a>
            <a href="mailto:dzone6226@gmail.com" className="mobile-social-item mail">
              <Mail size={16} /> dzone6226@gmail.com
            </a>
            <a href="https://instagram.com/DZONE_COLLECTION" target="_blank" rel="noreferrer" className="mobile-social-item insta">
              <InstagramIcon size={16} /> @DZONE_COLLECTION
            </a>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }
        .top-bar {
          background-color: var(--text-primary);
          color: #E6E0D4;
          font-size: 0.75rem;
          padding: 0.35rem 0;
          letter-spacing: 0.03em;
        }
        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .top-location {
          font-weight: 500;
          color: #D6CFBE;
        }
        .top-social-contacts {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .top-dot {
          color: #666;
        }
        .main-nav-container {
          padding: 0.85rem 0;
          background-color: #FFFFFF;
        }
        .main-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .logo-brand:hover {
          transform: scale(1.02);
        }
        .logo-glowing-wrapper {
          position: relative;
          padding: 2px;
          border-radius: 8px;
          background: linear-gradient(135deg, #DFB36E 0%, #C59B4E 50%, #8F6B2A 100%);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
          animation: goldPulseHalo 3s ease-in-out infinite alternate;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        @keyframes goldPulseHalo {
          0% { box-shadow: 0 0 8px rgba(212, 175, 55, 0.3); }
          100% { box-shadow: 0 0 18px rgba(243, 210, 106, 0.65); }
        }
        .header-brand-logo-img {
          height: 38px;
          width: 38px;
          object-fit: contain;
          border-radius: 6px;
          background-color: #0A0A0A;
          display: block;
          flex-shrink: 0;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .brand-title-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          line-height: 1.1;
        }
        .brand-dzone-highlighted {
          font-family: var(--font-heading);
          font-size: clamp(1.05rem, 4.2vw, 1.35rem);
          font-weight: 900;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #1C1A17 0%, #D4AF37 40%, #B8860B 75%, #1C1A17 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmerText 6s linear infinite;
          text-transform: uppercase;
          filter: drop-shadow(0 1px 2px rgba(212, 175, 55, 0.2));
        }
        @keyframes goldShimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .brand-collection-badge {
          font-family: var(--font-heading);
          font-size: clamp(0.6rem, 2vw, 0.75rem);
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #B8860B;
          text-transform: uppercase;
          background: var(--accent-gold-light);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(212, 175, 55, 0.35);
          white-space: nowrap;
        }
        .brand-sub {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          color: var(--accent-gold-dark);
          font-weight: 700;
          margin-top: 2px;
          text-transform: uppercase;
        }
        [data-theme="dark"] .brand-dzone-highlighted {
          background: linear-gradient(135deg, #FFFFFF 0%, #F5D77F 45%, #D4AF37 80%, #FFFFFF 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        [data-theme="dark"] .brand-collection-badge {
          color: #F3D26A !important;
          background: rgba(212, 175, 55, 0.15) !important;
          border-color: rgba(212, 175, 55, 0.4) !important;
        }
        .nav-and-icons-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .desktop-menu {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .desktop-menu {
            display: flex;
          }
        }
        .nav-link {
          font-size: 0.825rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          padding: 0.35rem 0;
          position: relative;
          transition: var(--transition-smooth);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-gold);
        }
        .inline-header-icons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 0.75rem;
          border-left: 1px solid var(--border-color);
        }
        .header-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: var(--transition-smooth);
          text-decoration: none;
        }
        .header-icon-btn.theme-toggle-btn:hover {
          background-color: var(--accent-gold-light);
          border-color: var(--accent-gold);
          transform: translateY(-2px) scale(1.05);
        }
        .sun-icon { color: #F59E0B; }
        .moon-icon { color: #8B5CF6; }
        .header-icon-btn.nav-wa:hover {
          background-color: #25D366;
          border-color: #25D366;
          color: #FFFFFF;
          transform: translateY(-2px);
        }
        .header-icon-btn.nav-mail:hover {
          background-color: var(--text-primary);
          border-color: var(--text-primary);
          color: var(--accent-gold);
          transform: translateY(-2px);
        }
        .header-icon-btn.nav-insta:hover {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          border-color: #E1306C;
          color: #FFFFFF;
          transform: translateY(-2px);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mobile-hamburger {
          display: block;
          color: var(--text-primary);
          padding: 0.25rem;
        }
        @media (min-width: 900px) {
          .mobile-hamburger {
            display: none;
          }
        }
        .mobile-drawer {
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 1.25rem 1.5rem;
          box-shadow: var(--shadow-md);
        }
        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }
        .mobile-nav-link {
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 0.5rem 0;
          color: var(--text-secondary);
          border-bottom: 1px dashed var(--border-light);
        }
        .mobile-nav-link.active {
          color: var(--accent-gold-dark);
          font-weight: 700;
        }
        .mobile-social-bar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-light);
        }
        .mobile-social-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
        }
        .mobile-social-item.wa { color: #25D366; }
        .mobile-social-item.mail { color: var(--accent-gold-dark); }
        .mobile-social-item.insta { color: #E1306C; }
        @media (max-width: 650px) {
          .top-bar-content {
            flex-direction: column;
            gap: 0.25rem;
            text-align: center;
            padding: 0.25rem 0.5rem;
          }
          .top-location {
            font-size: 0.7rem;
            white-space: normal;
            word-break: break-word;
          }
          .top-social-contacts {
            font-size: 0.7rem;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.4rem;
          }
          .inline-header-icons {
            display: none;
          }
          .header-brand-logo-img {
            height: 36px;
            width: 36px;
          }
          .main-nav {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </header>
  );
}

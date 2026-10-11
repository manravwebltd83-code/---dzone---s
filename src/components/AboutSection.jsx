import React, { useState } from 'react';
import { Award, Clock, MapPin, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight, Gem, Watch } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

export default function AboutSection() {
  const [activeStoryTab, setActiveStoryTab] = useState('QUALITY');

  const highlights = [
    {
      icon: Clock,
      title: 'Timeless Wristwatches',
      desc: 'Handpicked skeleton, automatic, chronograph, diamond, and leather belt watches.',
      tag: 'WATCHES'
    },
    {
      icon: Award,
      title: 'Genuine Leather Belts',
      desc: '100% full-grain leather with ratchet auto lock, kadi & press lock buckles.',
      tag: 'BELTS'
    },
    {
      icon: Sparkles,
      title: 'Crafted Jewellery',
      desc: 'Tarnish-resistant brass & steel chains, Kada, rings & luxury bracelets.',
      tag: 'JEWELLERY'
    },
    {
      icon: Gem,
      title: 'Long-Lasting Perfumes',
      desc: 'Signature body sprays, luxury car sprays & home fragrances.',
      tag: 'PERFUMES'
    }
  ];

  const storyTabs = {
    QUALITY: {
      title: 'Uncompromised Quality Since 2016',
      desc: 'Established in Royal Arcade, Surat, DZONE COLLECTION was born out of a passion for luxury fashion accessories. Every piece in our store is selected after strict quality checks to ensure premium durability and elegance.',
      points: ['100% Handpicked Selection', 'Premium Stainless Steel & Leather', 'Verified Store Warranty']
    },
    CRAFT: {
      title: 'Craftsmanship & Precision',
      desc: 'From high-grade automatic watch movements to smooth sliding auto-lock leather belts and heavy solid brass kadas, we prioritize perfection in every detail.',
      points: ['Scratch-Resistant Sapphire Glass', 'Genuine Italian Leather Straps', 'Heavy Solid Weight Kadas']
    },
    SURAT: {
      title: 'Surat’s Favorite Accessory Hub',
      desc: 'Located at Royal Arcade, Sarthana Jakatnaka, we welcome customers to visit our store, experience our products in person, and receive personalized recommendations.',
      points: ['Visit Us at Royal Arcade, Surat', 'Prepaid Express Dispatch', 'Instant WhatsApp Store Support']
    }
  };

  return (
    <section id="about-section" className="about-section">
      <div className="container">
        {/* Animated Main Card Wrapper */}
        <div className="about-card-wrapper animate-fade-in-up">
          {/* Header */}
          <div className="about-header text-center">
            <div className="about-badge-chip">
              <ShieldCheck size={14} /> SURAT’S PREMIER FASHION HUB
            </div>
            <h2 className="section-title animated-gradient-title">ABOUT DZONE COLLECTION</h2>
            <div className="gold-animated-line"></div>
            <p className="about-subtitle">
              Elevating daily style with luxury wristwatches, genuine leather belts, crafted jewellery, and signature fragrances.
            </p>
          </div>

          {/* 2-Column Animated Layout */}
          <div className="about-grid-content">
            {/* Left Column: Brand Logo Badge & Story Switcher */}
            <div className="about-story-col">
              <div className="brand-logo-showcase-box">
                <div className="glowing-logo-ring">
                  <img src={getAssetUrl('dzone_logo.png')} alt="DZONE COLLECTION Official Logo" className="about-brand-logo-img" />
                </div>
                <div className="since-badge">
                  <span className="since-year">ESTD. 2016</span>
                  <span className="since-city">SURAT, GUJARAT</span>
                </div>
              </div>

              {/* Story Tabs */}
              <div className="story-tabs-nav">
                <button
                  className={`story-tab-btn ${activeStoryTab === 'QUALITY' ? 'active' : ''}`}
                  onClick={() => setActiveStoryTab('QUALITY')}
                >
                  Quality Assurance
                </button>
                <button
                  className={`story-tab-btn ${activeStoryTab === 'CRAFT' ? 'active' : ''}`}
                  onClick={() => setActiveStoryTab('CRAFT')}
                >
                  Craftsmanship
                </button>
                <button
                  className={`story-tab-btn ${activeStoryTab === 'SURAT' ? 'active' : ''}`}
                  onClick={() => setActiveStoryTab('SURAT')}
                >
                  Surat Store
                </button>
              </div>

              {/* Active Tab Story Panel */}
              <div className="story-content-panel">
                <h3>{storyTabs[activeStoryTab].title}</h3>
                <p>{storyTabs[activeStoryTab].desc}</p>
                <ul className="story-points-list">
                  {storyTabs[activeStoryTab].points.map((pt, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="pt-icon" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Animated Stats & Category Highlights */}
            <div className="about-stats-col">
              {/* Counter Badges Row */}
              <div className="stats-counters-grid">
                <div className="stat-card">
                  <div className="stat-num">8+</div>
                  <div className="stat-label">Years of Excellence</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">5000+</div>
                  <div className="stat-label">Satisfied Clients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Genuine Quality</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">4</div>
                  <div className="stat-label">Core Categories</div>
                </div>
              </div>

              {/* Category Highlights Grid with Hover Motion */}
              <div className="highlights-motion-grid">
                {highlights.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="motion-highlight-card">
                      <div className="card-top-row">
                        <div className="motion-icon-box">
                          <IconComp size={22} />
                        </div>
                        <span className="item-tag">{item.tag}</span>
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Store Location Footer Banner */}
          <div className="about-location-banner">
            <div className="loc-info">
              <MapPin size={20} className="loc-pin-icon" />
              <div>
                <strong>VISIT OUR STORE IN SURAT</strong>
                <p>
                  Dzone Collection, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013, India
                </p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                'Dzone Collection, Royal Arcade, G-23, Marutidham Society, Sarthana Jakat Naka, Mani Nagar Society, Nana Varachha, Surat, Gujarat 395013'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary loc-btn"
            >
              View on Google Maps / Get Directions <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          padding: 5rem 0;
          background: linear-gradient(180deg, var(--bg-surface) 0%, #F4ECE0 100%);
          position: relative;
          overflow: hidden;
        }

        .about-card-wrapper {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 3.5rem 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04);
          position: relative;
        }
        @media (min-width: 992px) {
          .about-card-wrapper {
            padding: 4rem 3.5rem;
          }
        }

        .about-badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--accent-gold-light);
          color: var(--accent-gold-dark);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.85rem;
          border: 1px solid var(--accent-gold);
        }

        .animated-gradient-title {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        @media (min-width: 768px) {
          .animated-gradient-title {
            font-size: 2.75rem;
          }
        }

        .gold-animated-line {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
          margin: 0 auto 1.25rem;
          border-radius: 99px;
          animation: linePulse 2.5s infinite ease-in-out;
        }
        @keyframes linePulse {
          0%, 100% { transform: scaleX(0.7); opacity: 0.6; }
          50% { transform: scaleX(1.3); opacity: 1; }
        }

        .about-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* 2 Column Layout Grid */
        .about-grid-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-top: 3.5rem;
          align-items: start;
        }
        @media (min-width: 992px) {
          .about-grid-content {
            grid-template-columns: 1fr 1.15fr;
          }
        }

        /* Left Story Column */
        .about-story-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .brand-logo-showcase-box {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background-color: var(--bg-main);
          padding: 1.5rem 1.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .glowing-logo-ring {
          position: relative;
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          border-radius: var(--radius-sm);
          padding: 4px;
          background: linear-gradient(135deg, #C5A059, #F4ECE0, #A3803C);
          animation: logoGlow 3s infinite alternate ease-in-out;
        }
        @keyframes logoGlow {
          from { box-shadow: 0 0 10px rgba(197, 160, 89, 0.3); }
          to { box-shadow: 0 0 25px rgba(197, 160, 89, 0.7); }
        }

        .about-brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: calc(var(--radius-sm) - 2px);
          background-color: #FFFFFF;
        }

        .since-badge {
          display: flex;
          flex-direction: column;
        }
        .since-year {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .since-city {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: var(--accent-gold-dark);
          font-weight: 700;
        }

        /* Story Tabs Nav */
        .story-tabs-nav {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
          overflow-x: auto;
        }
        .story-tab-btn {
          padding: 0.6rem 1.15rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: transparent;
          white-space: nowrap;
          transition: var(--transition-smooth);
        }
        .story-tab-btn.active {
          background-color: var(--text-primary);
          color: #FFFFFF;
        }

        /* Story Content Panel */
        .story-content-panel {
          background-color: var(--bg-main);
          padding: 1.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          animation: fadeIn 0.3s ease-out;
        }
        .story-content-panel h3 {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.65rem;
        }
        .story-content-panel p {
          font-size: 0.925rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .story-points-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .story-points-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .pt-icon {
          color: var(--accent-gold-dark);
          flex-shrink: 0;
        }

        /* Right Stats Column */
        .about-stats-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stats-counters-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 500px) {
          .stats-counters-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-card {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 1.25rem 1rem;
          border-radius: var(--radius-sm);
          text-align: center;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-gold);
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--accent-gold-dark);
          margin-bottom: 0.15rem;
        }
        .stat-label {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Highlights Motion Grid */
        .highlights-motion-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .highlights-motion-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .motion-highlight-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.35rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .motion-highlight-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 12px 24px rgba(197, 160, 89, 0.15);
          border-color: var(--accent-gold);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .motion-icon-box {
          width: 44px;
          height: 44px;
          background-color: var(--accent-gold-light);
          color: var(--accent-gold-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .motion-highlight-card:hover .motion-icon-box {
          transform: rotate(10deg) scale(1.08);
          background-color: var(--accent-gold);
          color: #FFFFFF;
        }
        .item-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          background-color: var(--bg-main);
          color: var(--text-secondary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .motion-highlight-card h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .motion-highlight-card p {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Store Location Banner */
        .about-location-banner {
          margin-top: 3.5rem;
          background-color: var(--text-primary);
          color: #FFFFFF;
          padding: 1.5rem 2rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: flex-start;
          justify-content: space-between;
          border: 1px solid var(--accent-gold);
        }
        @media (min-width: 768px) {
          .about-location-banner {
            flex-direction: row;
            align-items: center;
          }
        }
        .loc-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .loc-pin-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
        }
        .loc-info strong {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          color: #FFFFFF;
          letter-spacing: 0.05em;
        }
        .loc-info p {
          font-size: 0.85rem;
          color: #CCCCCC;
          margin-top: 0.15rem;
        }
        .loc-btn {
          white-space: nowrap;
          padding: 0.75rem 1.35rem;
          font-size: 0.825rem;
        }

        @media (max-width: 650px) {
          .about-section {
            padding: 2.5rem 0;
            overflow: hidden;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }
          .about-card-wrapper {
            padding: 1.25rem 0.75rem;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }
          .animated-gradient-title {
            font-size: clamp(1.35rem, 6vw, 1.85rem);
            word-break: break-word;
          }
          .about-subtitle {
            font-size: 0.875rem;
            word-break: break-word;
          }
          .about-grid-content {
            margin-top: 1.5rem;
            gap: 1.5rem;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }
          .brand-logo-showcase-box {
            padding: 1rem 0.85rem;
            gap: 0.85rem;
            width: 100%;
            box-sizing: border-box;
          }
          .glowing-logo-ring {
            width: 56px;
            height: 56px;
          }
          .since-year {
            font-size: 1.05rem;
          }
          .since-city {
            font-size: 0.65rem;
          }
          .story-tabs-nav {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.35rem;
            width: 100%;
            box-sizing: border-box;
            overflow: visible;
          }
          .story-tab-btn {
            padding: 0.55rem 0.2rem;
            font-size: 0.7rem;
            font-weight: 700;
            text-align: center;
            white-space: normal;
            width: 100%;
            box-sizing: border-box;
            line-height: 1.2;
          }
          .story-content-panel {
            padding: 1.15rem 0.85rem;
            width: 100%;
            box-sizing: border-box;
            word-break: break-word;
          }
          .story-content-panel h3 {
            font-size: 1.15rem;
          }
          .story-content-panel p {
            font-size: 0.85rem;
          }
          .stats-counters-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            width: 100%;
            box-sizing: border-box;
          }
          .stat-card {
            padding: 0.75rem 0.35rem;
            width: 100%;
            box-sizing: border-box;
            word-break: break-word;
            overflow: hidden;
          }
          .stat-num {
            font-size: 1.3rem;
          }
          .stat-label {
            font-size: 0.625rem;
            line-height: 1.2;
            word-break: break-word;
          }
          .highlights-motion-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            width: 100%;
            box-sizing: border-box;
          }
          .motion-highlight-card {
            padding: 1rem 0.85rem;
            width: 100%;
            box-sizing: border-box;
          }
          .about-location-banner {
            margin-top: 2rem;
            margin-bottom: 2rem;
            padding: 1.25rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 1.15rem;
            width: 100%;
            box-sizing: border-box;
            word-break: break-word;
          }
          .loc-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            width: 100%;
            box-sizing: border-box;
          }
          .loc-info strong {
            font-size: 0.95rem;
            display: block;
            margin-bottom: 0.25rem;
          }
          .loc-info p {
            font-size: 0.8rem;
            line-height: 1.5;
            color: #CCCCCC;
            word-break: break-word;
          }
          .loc-btn {
            width: 100%;
            white-space: normal;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.85rem 0.75rem;
            font-size: 0.8rem;
            font-weight: 700;
            box-sizing: border-box;
            line-height: 1.3;
          }
        }
      `}</style>
    </section>
  );
}

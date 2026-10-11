import React from 'react';
import { Watch, Shield, Sparkles, Wind, ChevronRight } from 'lucide-react';

export default function MainCategories({ onSelectCategory, homepageMedia }) {
  const categories = [
    {
      id: 'WATCHES',
      title: 'WATCHES',
      desc: 'Premium, Standard & Ladies Watches',
      icon: Watch,
      price: '₹1,000 – ₹50,000',
      image: homepageMedia?.categoryImage_WATCHES || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'BELTS',
      title: 'BELTS',
      desc: 'Leather Belts',
      icon: Shield,
      price: '₹300 – ₹1,000',
      image: homepageMedia?.categoryImage_BELTS || 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'JEWELLERY',
      title: 'JEWELLERY',
      desc: 'Chains, Bracelets & Kada',
      icon: Sparkles,
      price: '₹300 – ₹5,000',
      image: homepageMedia?.categoryImage_JEWELLERY || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'PERFUMES',
      title: 'PERFUMES',
      desc: 'Perfumes, Body Sprays, Room Sprays & Car Sprays',
      icon: Wind,
      price: '₹200 – ₹5,000',
      image: homepageMedia?.categoryImage_PERFUMES || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop'
    },
  ];

  return (
    <section className="main-categories-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">CURATED CATEGORIES</span>
          <h2 className="section-title">MAIN CATEGORIES</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.title} />
                  <div className="category-overlay"></div>
                  <div className="category-icon-badge">
                    <IconComponent size={20} />
                  </div>
                </div>

                <div className="category-info">
                  <h3 className="category-title">{cat.title}</h3>
                  <p className="category-desc">{cat.desc}</p>
                  <div className="category-footer">
                    <span className="price-hint">Price: {cat.price}</span>
                    <span className="browse-link">
                      Browse <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .main-categories-section {
          padding: 4rem 0;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
        }
        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .section-subtitle {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-gold-dark);
          text-transform: uppercase;
        }
        .section-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0.25rem 0 0.75rem;
        }
        .gold-divider {
          width: 50px;
          height: 2px;
          background-color: var(--accent-gold);
          margin: 0 auto;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .category-card {
          background-color: var(--bg-main);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-gold);
        }
        .category-image-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .category-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-image-wrap img {
          transform: scale(1.06);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(28,28,28,0.4), transparent);
        }
        .category-icon-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold-dark);
          box-shadow: var(--shadow-sm);
        }
        .category-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .category-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }
        .category-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.4;
          flex-grow: 1;
        }
        .category-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-light);
        }
        .price-hint {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-gold-dark);
        }
        .browse-link {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .category-card:hover .browse-link {
          color: var(--accent-gold-dark);
        }
      `}</style>
    </section>
  );
}

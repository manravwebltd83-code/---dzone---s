import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, ThumbsUp, Quote, Sparkles, Filter, Award } from 'lucide-react';
import ReviewModal from './ReviewModal';

export default function ReviewsSection({ reviews, onAddReview }) {
  const [showModal, setShowModal] = useState(false);
  const [filterRating, setFilterRating] = useState('ALL');
  const [likedReviews, setLikedReviews] = useState({});

  const handleLike = (id) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'ALL') return true;
    if (filterRating === '5STAR') return r.rating === 5;
    if (filterRating === 'VERIFIED') return r.verified === true;
    return true;
  });

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
  };

  return (
    <section id="reviews-section" className="reviews-section">
      <div className="container">
        {/* Header with Animation */}
        <div className="section-header text-center">
          <div className="reviews-chip-badge">
            <Sparkles size={14} /> SURAT’S MOST TRUSTED STORE
          </div>
          <h2 className="section-title animated-gradient-title">CUSTOMER REVIEWS & FEEDBACK</h2>
          <div className="gold-animated-line"></div>
          <p className="section-sub-desc">
            Real experiences from valued customers who bought watches, belts, jewellery, and perfumes at DZONE COLLECTION Surat.
          </p>
        </div>

        {/* Rating Breakdown Banner */}
        <div className="reviews-dashboard-card animate-fade-in-up">
          <div className="dashboard-left">
            <div className="rating-score-circle">
              <span className="big-num">4.9</span>
              <span className="out-of">out of 5</span>
            </div>
            <div className="score-meta">
              <div className="rating-stars-animated">
                ★★★★★
              </div>
              <p className="total-reviews-txt">Based on <strong>{reviews.length} Verified Reviews</strong></p>
              <div className="trust-badge">
                <Award size={14} /> 100% Genuine Buyer Feedback
              </div>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="dashboard-middle">
            <div className="bar-row">
              <span className="bar-label">5 Stars</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '92%' }}></div>
              </div>
              <span className="bar-count">{ratingCounts[5] || reviews.length}</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">4 Stars</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '8%' }}></div>
              </div>
              <span className="bar-count">{ratingCounts[4] || 0}</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">3 Stars</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '0%' }}></div>
              </div>
              <span className="bar-count">0</span>
            </div>
          </div>

          <div className="dashboard-right">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-add-review-motion"
            >
              <MessageSquarePlus size={18} /> WRITE A REVIEW
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="reviews-filter-bar">
          <span className="filter-lbl"><Filter size={14} /> Filter:</span>
          <button
            className={`rev-filter-chip ${filterRating === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterRating('ALL')}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            className={`rev-filter-chip ${filterRating === '5STAR' ? 'active' : ''}`}
            onClick={() => setFilterRating('5STAR')}
          >
            5 Star Ratings ({ratingCounts[5] || reviews.length})
          </button>
          <button
            className={`rev-filter-chip ${filterRating === 'VERIFIED' ? 'active' : ''}`}
            onClick={() => setFilterRating('VERIFIED')}
          >
            Verified Buyers Only
          </button>
        </div>

        {/* Reviews Grid with 3D Motion */}
        <div className="animated-reviews-grid">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="animated-review-card">
              <Quote className="quote-watermark" size={54} />

              <div className="card-header-row">
                <div className="avatar-circle-glow">
                  {rev.name.charAt(0).toUpperCase()}
                </div>
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{rev.name}</h4>
                  <span className="reviewer-location">📍 {rev.location}</span>
                </div>
                {rev.verified && (
                  <span className="verified-chip" title="Verified Customer">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>

              <div className="rating-date-row">
                <div className="stars-flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star-gold ${i < rev.rating ? 'active' : ''}`}>★</span>
                  ))}
                </div>
                <span className="rev-date-str">{rev.date}</span>
              </div>

              <p className="review-comment-body">"{rev.comment}"</p>

              <div className="card-footer-action">
                <button
                  type="button"
                  className={`like-helpful-btn ${likedReviews[rev.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(rev.id)}
                >
                  <ThumbsUp size={13} /> {likedReviews[rev.id] ? 'Helpful (1)' : 'Helpful'}
                </button>
                <span className="store-tag">Surat Store Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          onSubmitReview={onAddReview}
        />
      )}

      <style>{`
        .reviews-section {
          padding: 5rem 0;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-light);
          position: relative;
        }

        .reviews-chip-badge {
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

        .reviews-dashboard-card {
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 900px) {
          .reviews-dashboard-card {
            grid-template-columns: 1.1fr 1.2fr 1fr;
          }
        }

        .dashboard-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .rating-score-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%);
          color: #FFFFFF;
          border-radius: var(--radius-full);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(197, 160, 89, 0.35);
          flex-shrink: 0;
        }
        .big-num {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1;
        }
        .out-of {
          font-size: 0.65rem;
          opacity: 0.9;
        }
        .rating-stars-animated {
          color: #FFB800;
          font-size: 1.25rem;
          letter-spacing: 0.1em;
        }
        .total-reviews-txt {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }
        .trust-badge {
          font-size: 0.725rem;
          color: var(--accent-gold-dark);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.35rem;
        }

        .dashboard-middle {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .bar-label { width: 50px; font-weight: 600; }
        .bar-track {
          flex-grow: 1;
          height: 8px;
          background-color: var(--border-light);
          border-radius: 99px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-dark));
          border-radius: 99px;
          transition: width 0.8s ease;
        }
        .bar-count { width: 25px; text-align: right; font-weight: 700; }

        .dashboard-right {
          text-align: center;
        }
        .btn-add-review-motion {
          padding: 0.9rem 1.5rem;
          font-size: 0.85rem;
          width: 100%;
        }

        /* Filter Pills */
        .reviews-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }
        .filter-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .rev-filter-chip {
          padding: 0.5rem 1.15rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 600;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          white-space: nowrap;
          transition: var(--transition-smooth);
        }
        .rev-filter-chip:hover, .rev-filter-chip.active {
          background-color: var(--text-primary);
          color: #FFFFFF;
          border-color: var(--text-primary);
        }

        /* Animated Grid Cards */
        .animated-reviews-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .animated-reviews-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .animated-review-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          overflow: hidden;
        }
        .animated-review-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-gold);
        }

        .quote-watermark {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          color: var(--accent-gold-light);
          opacity: 0.4;
          pointer-events: none;
        }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar-circle-glow {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--text-primary) 0%, #333333 100%);
          color: var(--accent-gold);
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .reviewer-info {
          flex-grow: 1;
        }
        .reviewer-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .reviewer-location {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .verified-chip {
          font-size: 0.7rem;
          color: #03543F;
          background-color: #DEF7EC;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rating-date-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stars-flex {
          display: flex;
          gap: 0.15rem;
        }
        .star-gold {
          color: #E2E8F0;
          font-size: 1.15rem;
        }
        .star-gold.active {
          color: #FFB800;
        }
        .rev-date-str {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .review-comment-body {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-style: italic;
          position: relative;
          z-index: 1;
        }

        .card-footer-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-color);
          margin-top: auto;
          position: relative;
          z-index: 1;
        }
        .like-helpful-btn {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }
        .like-helpful-btn:hover, .like-helpful-btn.liked {
          color: var(--accent-gold-dark);
          background-color: var(--accent-gold-light);
        }
        .store-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

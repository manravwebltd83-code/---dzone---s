import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';

export default function ReviewModal({ onClose, onSubmitReview }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Surat');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) {
      alert('Please fill in your name and review message.');
      return;
    }

    const newReview = {
      id: `r-${Date.now()}`,
      name,
      location: location || 'Surat',
      rating: Number(rating),
      date: 'Just now',
      comment,
      verified: true
    };

    onSubmitReview(newReview);
    onClose();
    alert('Thank you for your feedback! Your review has been published.');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Leave Review & Feedback</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Amit Shah"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Area / Location in Surat</label>
            <input
              type="text"
              placeholder="e.g. Sarthana Jakatnaka, Surat"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
              <span className="rating-num-label">{rating} / 5 Stars</span>
            </div>
          </div>

          <div className="form-group">
            <label>Your Review / Experience *</label>
            <textarea
              rows="4"
              required
              placeholder="Tell us about the watch, belt, jewellery or perfume quality and your store experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="review-form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Submit Review
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .review-modal-card {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          position: relative;
        }

        .review-modal-header {
          padding: 1.25rem 1.5rem;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .review-modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .review-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .star-rating-selector {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .star-btn {
          font-size: 1.6rem;
          color: #DDD;
          transition: color 0.15s ease;
        }
        .star-btn.active {
          color: #FFB800;
        }
        .rating-num-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-left: 0.5rem;
        }

        .review-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
}

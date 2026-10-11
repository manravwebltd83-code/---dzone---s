import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Hero({ onExploreClick, onOpenWhatsappPopup, homepageMedia }) {
  const instagramUrl = "https://instagram.com/DZONE_COLLECTION";

  // 4 Configurable Hero Slides Pool
  const slides = [
    {
      id: 1,
      image1: homepageMedia?.heroImage1 || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
      tag1: "Watches",
      image2: homepageMedia?.heroImage2 || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop",
      tag2: "Perfumes"
    },
    {
      id: 2,
      image1: homepageMedia?.heroImage3 || "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop",
      tag1: "Belts",
      image2: homepageMedia?.heroImage4 || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      tag2: "Jewellery"
    },
    {
      id: 3,
      image1: homepageMedia?.heroImage2 || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop",
      tag1: "Fragrances",
      image2: homepageMedia?.heroImage1 || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
      tag2: "Automatic Watches"
    },
    {
      id: 4,
      image1: homepageMedia?.heroImage4 || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      tag1: "Steel Kada",
      image2: homepageMedia?.heroImage3 || "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop",
      tag2: "Auto-Lock Belts"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play slideshow every 4 seconds for ultra smooth transition pacing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">SURAT'S FINEST SELECTION</div>
          <h1 className="hero-heading">
            DZONE COLLECTION.<br />
            <span className="hero-heading-sub">SURAT.</span>
          </h1>

          <p className="hero-small-text">
            Watches • Belts • Jewellery • Perfumes
          </p>

          <div className="hero-actions">
            <button onClick={onExploreClick} className="btn btn-primary hero-btn">
              EXPLORE COLLECTION <ArrowRight size={16} />
            </button>

            <button onClick={onOpenWhatsappPopup} className="btn btn-whatsapp hero-btn">
              <MessageCircle size={18} /> WHATSAPP ENQUIRY
            </button>
          </div>

          {/* Instagram Profile Quick Badge */}
          <div className="hero-insta-badge-wrap">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="hero-insta-badge">
              <span className="insta-icon-circle">
                <InstagramIcon size={16} />
              </span>
              <span>Follow us on Instagram <strong>@DZONE_COLLECTION</strong></span>
            </a>
          </div>
        </div>

        {/* Hero Visual Section with Animated Gold Ambient Background & Ultra-Smooth Auto Crossfade Slider */}
        <div className="hero-visual animate-fade-in-up delay-200">
          {/* Continuous Animated Background Aura Rings */}
          <div className="continuous-gold-aura-ring"></div>
          <div className="continuous-gold-glow-orb-1"></div>
          <div className="continuous-gold-glow-orb-2"></div>

          {/* Ultra Smooth Layered Cross-Fade Slider Container */}
          <div className="hero-slider-wrapper">
            <div className="hero-card-grid-container">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`hero-card-grid slide-layer ${activeIndex === idx ? 'slide-active' : 'slide-inactive'}`}
                >
                  <div className="hero-image-card card-1">
                    <img src={slide.image1} alt={slide.tag1} />
                    <span className="hero-tag">{slide.tag1}</span>
                  </div>
                  <div className="hero-image-card card-2">
                    <img src={slide.image2} alt={slide.tag2} />
                    <span className="hero-tag">{slide.tag2}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Controls & Indicators */}
            <div className="slider-controls-bar">
              <button className="slider-arrow-btn" onClick={handlePrev} title="Previous Slide">
                <ChevronLeft size={16} />
              </button>
              
              <div className="slider-dots">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${activeIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button className="slider-arrow-btn" onClick={handleNext} title="Next Slide">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          background-color: var(--bg-main);
          padding: 3.5rem 0 4rem;
          border-bottom: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 850px) {
          .hero-container {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }
        .hero-badge {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-gold-dark);
          background-color: var(--accent-gold-light);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
          border: 1px solid var(--border-color);
        }
        .hero-heading {
          font-size: clamp(1.85rem, 6.5vw, 3.5rem);
          line-height: 1.15;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .hero-heading-sub {
          color: var(--accent-gold);
          font-weight: 500;
        }
        .hero-small-text {
          font-size: clamp(0.9rem, 2.8vw, 1.05rem);
          color: var(--text-secondary);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .hero-btn {
          flex: 1 1 140px;
          min-width: 0;
          box-sizing: border-box;
        }
        .hero-insta-badge-wrap {
          margin-top: 0.5rem;
        }
        .hero-insta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.85rem;
          max-width: 100%;
          background-color: #FFFFFF;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          font-size: clamp(0.725rem, 2.2vw, 0.8rem);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-smooth);
        }
        .hero-insta-badge:hover {
          border-color: #E1306C;
          color: #E1306C;
          transform: translateY(-2px);
        }
        .insta-icon-circle {
          width: 26px;
          height: 26px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #FFFFFF;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        /* Continuous Background Animation Effects */
        .hero-visual {
          position: relative;
          padding: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .continuous-gold-aura-ring {
          position: absolute;
          top: -20px;
          right: -20px;
          width: clamp(180px, 45vw, 280px);
          height: clamp(180px, 45vw, 280px);
          border-radius: 50%;
          border: 2px dashed rgba(212, 175, 55, 0.35);
          animation: continuousRotate 28s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .continuous-gold-glow-orb-1 {
          position: absolute;
          top: 10%;
          left: 10%;
          width: clamp(150px, 35vw, 220px);
          height: clamp(150px, 35vw, 220px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0) 70%);
          filter: blur(25px);
          animation: floatingGlow 10s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }
        .continuous-gold-glow-orb-2 {
          position: absolute;
          bottom: 10%;
          right: 5%;
          width: clamp(160px, 40vw, 260px);
          height: clamp(160px, 40vw, 260px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 215, 127, 0.22) 0%, rgba(212, 175, 55, 0) 70%);
          filter: blur(30px);
          animation: floatingGlow 14s ease-in-out infinite alternate-reverse;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes continuousRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes floatingGlow {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0.6; }
          50% { transform: translate(25px, -20px) scale(1.15); opacity: 0.95; }
          100% { transform: translate(-15px, 15px) scale(0.95); opacity: 0.7; }
        }

        /* Ultra Smooth Layered Cross-Fade Slider Container */
        .hero-slider-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .hero-card-grid-container {
          position: relative;
          width: 100%;
          min-height: clamp(240px, 58vw, 440px);
        }

        .slide-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transform: scale(0.96) translateY(6px);
          transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), 
                      transform 1.2s cubic-bezier(0.25, 1, 0.5, 1),
                      visibility 1.2s step-end;
          pointer-events: none;
          z-index: 1;
        }

        .slide-layer.slide-active {
          opacity: 1;
          visibility: visible;
          transform: scale(1) translateY(0);
          transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), 
                      transform 1.2s cubic-bezier(0.25, 1, 0.5, 1),
                      visibility 0s step-start;
          pointer-events: auto;
          z-index: 3;
        }

        .hero-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.5rem, 2.5vw, 1.25rem);
          height: 100%;
        }

        .hero-image-card {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
          aspect-ratio: 4/5;
          background: #FFF;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .hero-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hero-image-card:hover {
          box-shadow: 0 15px 35px rgba(212, 175, 55, 0.25);
          border-color: var(--accent-gold);
        }
        .hero-image-card:hover img {
          transform: scale(1.08);
        }
        .hero-tag {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(28, 28, 28, 0.88);
          color: #FFF;
          backdrop-filter: blur(6px);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(212, 175, 55, 0.4);
        }
        .card-1 {
          animation: floatGentle 5s ease-in-out infinite;
        }
        .card-2 {
          transform: translateY(1.25rem);
          animation: floatGentle 5s ease-in-out infinite 2.5s;
        }

        /* Slider Bar Controls */
        .slider-controls-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .slider-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .slider-arrow-btn:hover {
          background: var(--accent-gold);
          color: #FFFFFF;
          border-color: var(--accent-gold);
        }
        .slider-dots {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #CBD5E1;
          border: none;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .slider-dot.active {
          width: 22px;
          border-radius: 10px;
          background: var(--accent-gold);
        }
      `}</style>
    </section>
  );
}

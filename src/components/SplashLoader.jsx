import React, { useEffect, useState } from 'react';
import { getAssetUrl } from '../utils/assetHelper';

export default function SplashLoader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start curtain fade out after 1.5s
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1600);

    // Completely unmount splash after fade transition finishes (2.1s)
    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`splash-loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-emblem-wrap">
          <img src={getAssetUrl('dzone_logo.png')} alt="DZONE Collection Logo" className="splash-logo-img" />
          <div className="splash-ring"></div>
        </div>

        <h1 className="splash-title">DZONE COLLECTION</h1>
        <p className="splash-sub">TIMELESS STYLE • SURAT</p>

        <div className="splash-progress-track">
          <div className="splash-progress-bar"></div>
        </div>
      </div>

      <style>{`
        .splash-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #1C1C1C;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .splash-loader-overlay.fade-out {
          opacity: 0;
          transform: translateY(-20px);
          pointer-events: none;
        }

        .splash-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: splashZoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes splashZoomIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .splash-emblem-wrap {
          position: relative;
          width: 84px;
          height: 84px;
          margin-bottom: 1.25rem;
        }

        .splash-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 8px 30px rgba(197, 160, 89, 0.35);
        }

        .splash-ring {
          position: absolute;
          inset: -6px;
          border: 1px solid rgba(197, 160, 89, 0.4);
          border-radius: calc(var(--radius-md) + 4px);
          animation: ringPulse 1.8s infinite ease-in-out;
        }

        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .splash-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          margin-bottom: 0.35rem;
          background: linear-gradient(90deg, #FFFFFF, #E6D5B8, #FFFFFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .splash-sub {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: var(--accent-gold);
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .splash-progress-track {
          width: 160px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.12);
          border-radius: 99px;
          overflow: hidden;
        }

        .splash-progress-bar {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #C5A059, #F4ECE0);
          animation: splashFill 1.5s ease-in-out forwards;
          transform-origin: left;
        }

        @keyframes splashFill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}

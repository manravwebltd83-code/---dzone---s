import React, { useState } from 'react';
import { User, Key, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

export default function AdminLogin({ onLoginSuccess, onClose, adminAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const validUser = adminAuth?.username || 'dzone';
    const validPass = adminAuth?.password || 'dzone123';

    if (username.trim() === validUser && password === validPass) {
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid Username or Password.');
    }
  };

  return (
    <div className="admin-login-page-root">
      <div className="admin-login-card">
        <button className="login-back-btn" onClick={onClose} title="Return to Public Website">
          <X size={20} />
        </button>

        <div className="admin-login-header">
          <div className="login-emblem">
            <img src={getAssetUrl('dzone_logo.png')} alt="DZONE Logo" className="login-logo-img" />
          </div>
          <h2>DZONE Store Admin Login</h2>
          <p>Full Management Console Access for DZONE COLLECTION Surat</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          {errorMsg && (
            <div className="login-error-alert">
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <Key size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Login to Full Admin Console <ArrowRight size={16} />
          </button>
        </form>

        <div className="login-footer-hint">
          <span>Protected Store Console • Surat Store Operations</span>
        </div>
      </div>

      <style>{`
        .admin-login-page-root {
          min-height: 100vh;
          background: #F4F1EA;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: var(--font-body);
        }

        .admin-login-card {
          background-color: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          position: relative;
        }

        .login-back-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.2);
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        .login-back-btn:hover {
          background: #FFFFFF;
          color: var(--text-primary);
        }

        .admin-login-header {
          background-color: var(--text-primary);
          color: #FFFFFF;
          padding: 2.5rem 1.5rem 1.75rem;
          text-align: center;
        }

        .login-emblem {
          width: 68px;
          height: 68px;
          margin: 0 auto 1rem;
        }
        .login-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .admin-login-header h2 {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
        }

        .admin-login-header p {
          font-size: 0.8rem;
          color: var(--accent-gold);
        }

        .admin-login-form {
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-error-alert {
          background-color: #FFEBEE;
          color: #C62828;
          border: 1px solid #FFCDD2;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          text-align: center;
        }

        .input-icon-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-icon-wrap input {
          width: 100%;
          padding: 0.75rem 0.85rem 0.75rem 2.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          outline: none;
        }

        .input-icon-wrap input:focus {
          border-color: var(--accent-gold);
        }

        .login-btn {
          width: 100%;
          padding: 0.9rem;
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }

        .login-footer-hint {
          background-color: var(--bg-main);
          padding: 0.75rem 1.5rem;
          text-align: center;
          border-top: 1px solid var(--border-light);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

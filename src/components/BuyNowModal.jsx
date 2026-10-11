import React, { useState } from 'react';
import { getAssetUrl, getProductImages } from '../utils/assetHelper';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Hash,
  Send,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  CreditCard,
  ShieldCheck,
  ZoomIn
} from 'lucide-react';

export default function BuyNowModal({ product, onClose, onSubmitOrder }) {
  const modalImages = getProductImages(product);
  const modalMainImg = modalImages[0];
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Surat');
  const [pincode, setPincode] = useState('395006');
  const [quantity, setQuantity] = useState(1);
  const [paymentMode] = useState('Prepaid Online UPI (BharatPe QR)');
  const [utrNo, setUtrNo] = useState('');

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [zoomQr, setZoomQr] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  if (!product) return null;

  const totalPrice = Number(product.price) * Number(quantity);
  const upiId = 'BHARATPE2K0H0M4S7E64260@unitype';

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName || !mobile || !address || !pincode) {
      alert('Please fill in your Name, Mobile Number, Address, and Pincode.');
      return;
    }

    const orderData = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : 'Not provided',
      address: address.trim(),
      city: (city || 'Surat').trim(),
      pincode: pincode.trim(),
      productName: product.name,
      productCategory: product.category,
      productPrice: Number(product.price),
      quantity: Number(quantity),
      totalPrice,
      paymentMode,
      utrNo: utrNo.trim() || 'Pending verification',
      status: 'New Lead',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    // Save order lead directly to system state & local storage
    onSubmitOrder(orderData);

    // Switch view to Order Success Greeting Card
    setSubmittedOrder(orderData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="buy-now-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {submittedOrder ? (
          /* ORDER SUCCESS GREETING CARD VIEW */
          <div className="order-success-view">
            <div className="success-header">
              <div className="success-icon-badge">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="success-title">ORDER PLACED SUCCESSFULLY!</h3>
              <p className="success-subtitle">
                Thank you <strong>{submittedOrder.customerName}</strong>! Your prepaid order request is received.
              </p>
            </div>

            <div className="success-card-body">
              <div className="order-id-chip">
                ORDER LEAD ID: <span>#{submittedOrder.id}</span>
              </div>

              <div className="greeting-summary-box">
                <h4 className="greeting-box-title">Order & Delivery Details</h4>

                <div className="greeting-row">
                  <span className="g-lbl">Product:</span>
                  <span className="g-val"><strong>{submittedOrder.productName}</strong></span>
                </div>

                <div className="greeting-row">
                  <span className="g-lbl">Quantity & Total:</span>
                  <span className="g-val price-val">
                    Qty: {submittedOrder.quantity} • <strong>₹{submittedOrder.totalPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div className="greeting-row">
                  <span className="g-lbl">Payment Mode:</span>
                  <span className="g-val" style={{ color: '#03543F', fontWeight: 700 }}>
                    ⚡ Prepaid UPI Scanner
                  </span>
                </div>

                {submittedOrder.utrNo && submittedOrder.utrNo !== 'Pending verification' && (
                  <div className="greeting-row">
                    <span className="g-lbl">Transaction UTR:</span>
                    <span className="g-val">{submittedOrder.utrNo}</span>
                  </div>
                )}

                <div className="greeting-row">
                  <span className="g-lbl">Customer Name:</span>
                  <span className="g-val">{submittedOrder.customerName}</span>
                </div>

                <div className="greeting-row">
                  <span className="g-lbl">Mobile:</span>
                  <span className="g-val">{submittedOrder.mobile}</span>
                </div>

                {submittedOrder.email && submittedOrder.email !== 'Not provided' && (
                  <div className="greeting-row">
                    <span className="g-lbl">Gmail / Email:</span>
                    <span className="g-val">{submittedOrder.email}</span>
                  </div>
                )}

                <div className="greeting-row">
                  <span className="g-lbl">Address:</span>
                  <span className="g-val">{submittedOrder.address}, {submittedOrder.city} - {submittedOrder.pincode}</span>
                </div>
              </div>

              {/* QR Scanner Display inside Order Confirmation */}
              <div className="success-qr-banner">
                <div className="qr-mini-title">⚡ Pay / Confirm via BharatPe UPI Scanner</div>
                <img
                  src={getAssetUrl('payment_qr.jpg')}
                  alt="BharatPe QR Scanner"
                  className="success-qr-img"
                  onClick={() => setZoomQr(true)}
                />
                <div className="upi-id-badge">
                  <span>{upiId}</span>
                  <button type="button" onClick={handleCopyUpi} className="mini-copy-btn">
                    {copiedUpi ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="store-assurance-note">
                📍 <strong>DZONE COLLECTION Surat</strong> team will review your payment confirmation and dispatch your order promptly!
              </div>

              <div className="success-actions-row">
                <button onClick={onClose} className="btn btn-primary continue-shop-btn">
                  CONTINUE SHOPPING <ArrowRight size={16} />
                </button>

                <a
                  href={`https://wa.me/919624165548?text=${encodeURIComponent(
                    `Hello DZONE COLLECTION, I have completed payment for Order #${submittedOrder.id} (${submittedOrder.productName} - ₹${submittedOrder.totalPrice}). Please confirm dispatch!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp opt-wa-btn"
                  title="Share Payment Screenshot on WhatsApp"
                >
                  <MessageCircle size={15} /> Send Payment Receipt
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <>
            <div className="buy-now-header">
              <div className="buy-header-icon">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3>BUY NOW - DIRECT CHECKOUT</h3>
                <p>DZONE COLLECTION • Royal Arcade, Surat</p>
              </div>
            </div>

            {/* Selected Product Banner */}
            <div className="order-product-summary">
              {modalMainImg ? (
                <img
                  src={modalMainImg}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ width: 64, height: 64, backgroundColor: '#f1f5f9', borderRadius: 8, flexShrink: 0 }} />
              )}
              <div className="summary-info">
                <span className="badge badge-gold">{product.category}</span>
                <h4 className="summary-title">{product.name}</h4>
                <div className="summary-price-row">
                  <span className="unit-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  <div className="qty-picker">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span>Qty: {quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleSubmit} className="checkout-form">
              <h4 className="form-subheading">1. Delivery Address</h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <div className="input-with-icon">
                    <User size={14} className="field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Patel"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <div className="input-with-icon">
                    <Phone size={14} className="field-icon" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98250 12345"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full-w">
                  <label>Gmail / Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={14} className="field-icon" />
                    <input
                      type="email"
                      placeholder="e.g. customer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full-w">
                  <label>Full Delivery Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={14} className="field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No., Building, Street Name..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <div className="input-with-icon">
                    <Building size={14} className="field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surat"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode *</label>
                  <div className="input-with-icon">
                    <Hash size={14} className="field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 395006"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT SECTION WITH BHARATPE UPI QR SCANNER */}
              <div className="payment-prepaid-container">
                <div className="prepaid-notice-bar">
                  <ShieldCheck size={16} />
                  <span><strong>ONLY PREPAID DELIVERY AVAILABLE</strong> • Cash on Delivery Disabled</span>
                </div>

                <h4 className="form-subheading" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                  2. Scan & Pay via UPI (BharatPe)
                </h4>

                <div className="qr-scanner-card">
                  <div className="qr-card-top">
                    <span className="qr-payee-tag">BharatPe Merchant Account</span>
                    <span className="qr-payee-name">GOLAVIYA DAXAY L.</span>
                  </div>

                  <div className="qr-image-wrapper">
                    <img
                      src={getAssetUrl('payment_qr.jpg')}
                      alt="BharatPe UPI QR Code Scanner"
                      className="qr-scanner-img"
                      onClick={() => setZoomQr(true)}
                    />
                    <div className="qr-overlay-hint" onClick={() => setZoomQr(true)}>
                      <ZoomIn size={14} /> Tap to enlarge QR
                    </div>
                  </div>

                  <div className="upi-id-row">
                    <div className="upi-id-content">
                      <span className="upi-lbl">BHARATPE UPI ID:</span>
                      <strong className="upi-val">{upiId}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn-copy-upi"
                      onClick={handleCopyUpi}
                    >
                      {copiedUpi ? (
                        <><Check size={14} /> COPIED</>
                      ) : (
                        <><Copy size={14} /> COPY UPI ID</>
                      )}
                    </button>
                  </div>

                  <div className="upi-apps-row">
                    <span>Scan with any UPI App:</span>
                    <div className="app-chips">
                      <span className="app-chip gpay">Google Pay</span>
                      <span className="app-chip phonepe">PhonePe</span>
                      <span className="app-chip paytm">Paytm</span>
                      <span className="app-chip bhim">BHIM UPI</span>
                    </div>
                  </div>
                </div>

                <div className="form-group full-w" style={{ marginTop: '0.85rem' }}>
                  <label>Payment Ref UTR / Transaction ID (Optional / Recommended)</label>
                  <div className="input-with-icon">
                    <CreditCard size={14} className="field-icon" />
                    <input
                      type="text"
                      placeholder="e.g. 428195821092"
                      value={utrNo}
                      onChange={(e) => setUtrNo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="order-total-bar">
                <div>
                  <span>Total Payable Amount:</span>
                  <h3 className="final-total">₹{totalPrice.toLocaleString('en-IN')}</h3>
                </div>
                <button type="submit" className="btn btn-primary place-order-btn">
                  <Send size={16} /> CONFIRM & PLACE PREPAID ORDER
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Full Screen Image Zoom Modal for QR Scanner */}
      {zoomQr && (
        <div className="qr-zoom-backdrop" onClick={() => setZoomQr(false)}>
          <div className="qr-zoom-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="qr-zoom-close" onClick={() => setZoomQr(false)}>
              <X size={20} />
            </button>
            <h4 className="zoom-title">GOLAVIYA DAXAY L. (BharatPe)</h4>
            <img src={getAssetUrl('payment_qr.jpg')} alt="Enlarged BharatPe QR Scanner" className="zoomed-qr-img" />
            <div className="zoom-upi-text">{upiId}</div>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleCopyUpi} style={{ marginTop: 8 }}>
              {copiedUpi ? '✓ UPI ID Copied!' : 'Copy UPI ID'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .buy-now-card {
          background: #FFFFFF;
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 580px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          position: relative;
          max-height: 94vh;
          overflow-y: auto;
          animation: popUp 0.25s ease-out;
        }

        @keyframes popUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .buy-now-header {
          background-color: var(--text-primary);
          color: #FFFFFF;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .buy-header-icon {
          width: 42px;
          height: 42px;
          background-color: var(--accent-gold);
          color: var(--text-primary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .buy-now-header h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          color: #FFFFFF;
          font-weight: 700;
        }
        .buy-now-header p {
          font-size: 0.75rem;
          color: var(--accent-gold);
        }

        .order-product-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-light);
        }
        .order-product-summary img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        .summary-info {
          flex-grow: 1;
        }
        .summary-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .summary-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
        }
        .unit-price {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-gold-dark);
        }
        .qty-picker {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFF;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .qty-picker button {
          font-weight: 700;
          padding: 0 0.35rem;
          color: var(--text-primary);
        }

        .checkout-form {
          padding: 1.5rem;
        }
        .form-subheading {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group.full-w { grid-column: 1 / -1; }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .input-with-icon {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-with-icon input {
          width: 100%;
          padding: 0.65rem 0.85rem 0.65rem 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          outline: none;
        }
        .input-with-icon input:focus {
          border-color: var(--accent-gold);
        }

        /* PREPAID DELIVERY & QR SCANNER STYLES */
        .payment-prepaid-container {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--border-color);
        }
        .prepaid-notice-bar {
          background-color: #FEF3C7;
          border: 1px solid #F59E0B;
          color: #92400E;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .qr-scanner-card {
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: var(--radius-md);
          padding: 1.25rem;
          text-align: center;
          margin-top: 0.75rem;
        }
        .qr-card-top {
          margin-bottom: 0.85rem;
        }
        .qr-payee-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748B;
          display: block;
        }
        .qr-payee-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
        }
        .qr-image-wrapper {
          position: relative;
          display: inline-block;
          margin: 0.25rem 0;
          cursor: pointer;
        }
        .qr-scanner-img {
          width: 220px;
          height: auto;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 3px solid #FFFFFF;
          transition: transform 0.2s ease;
        }
        .qr-scanner-img:hover {
          transform: scale(1.02);
        }
        .qr-overlay-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          font-size: 0.7rem;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        .upi-id-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          margin-top: 0.85rem;
          gap: 0.5rem;
        }
        .upi-id-content {
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .upi-lbl {
          font-size: 0.65rem;
          color: #64748B;
          display: block;
        }
        .upi-val {
          font-size: 0.8rem;
          color: #0F172A;
          word-break: break-all;
        }
        .btn-copy-upi {
          background-color: var(--accent-gold);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.7rem;
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: var(--transition-smooth);
        }
        .btn-copy-upi:hover {
          background-color: var(--accent-gold-dark);
          color: #FFFFFF;
        }

        .upi-apps-row {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: #64748B;
        }
        .app-chips {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 0.35rem;
        }
        .app-chip {
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
        }
        .app-chip.gpay { color: #4285F4; border-color: #BFDBFE; }
        .app-chip.phonepe { color: #5F259F; border-color: #DDD6FE; }
        .app-chip.paytm { color: #00B9F1; border-color: #BAE6FD; }
        .app-chip.bhim { color: #03543F; border-color: #A7F3D0; }

        .order-total-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .order-total-bar span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .final-total {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .place-order-btn {
          padding: 0.85rem 1.25rem;
          font-size: 0.8rem;
        }

        /* ORDER SUCCESS GREETING CARD STYLES */
        .order-success-view {
          padding: 2rem 1.5rem;
          text-align: center;
        }
        .success-header {
          margin-bottom: 1.5rem;
        }
        .success-icon-badge {
          width: 68px;
          height: 68px;
          background-color: #DEF7EC;
          color: #03543F;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .success-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          color: var(--text-primary);
          font-weight: 700;
        }
        .success-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }
        .order-id-chip {
          display: inline-block;
          background-color: var(--bg-main);
          border: 1px dashed var(--accent-gold);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        .order-id-chip span {
          color: var(--accent-gold-dark);
          font-weight: 700;
        }
        .greeting-summary-box {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          text-align: left;
          margin-bottom: 1rem;
        }
        .greeting-box-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.4rem;
        }
        .greeting-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          margin-bottom: 0.4rem;
        }
        .g-lbl {
          color: var(--text-secondary);
          width: 35%;
        }
        .g-val {
          color: var(--text-primary);
          width: 65%;
          text-align: right;
        }
        .price-val {
          color: var(--accent-gold-dark);
        }

        .success-qr-banner {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          margin-bottom: 1.25rem;
        }
        .qr-mini-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #03543F;
          margin-bottom: 0.5rem;
        }
        .success-qr-img {
          width: 140px;
          height: auto;
          border-radius: 8px;
          border: 2px solid #FFF;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .upi-id-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #334155;
          margin-top: 0.5rem;
          background: #FFF;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          word-break: break-all;
        }
        .mini-copy-btn {
          background: var(--accent-gold);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .store-assurance-note {
          font-size: 0.8rem;
          color: var(--text-secondary);
          background-color: #F8F9FA;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
        }
        .success-actions-row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .continue-shop-btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.85rem;
        }
        .opt-wa-btn {
          padding: 0.75rem 1.25rem;
          font-size: 0.85rem;
        }

        /* QR ZOOM MODAL */
        .qr-zoom-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }
        .qr-zoom-dialog {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          position: relative;
          max-width: 380px;
          width: 100%;
        }
        .qr-zoom-close {
          position: absolute;
          right: 12px;
          top: 12px;
          background: #F1F5F9;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zoom-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #0F172A;
        }
        .zoomed-qr-img {
          width: 100%;
          max-width: 280px;
          height: auto;
          border-radius: 12px;
          border: 2px solid #E2E8F0;
        }
        .zoom-upi-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          margin-top: 0.75rem;
          word-break: break-all;
        }
        @media (max-width: 520px) {
          .buy-now-card {
            width: 100%;
            max-width: 100%;
            margin: 0;
            max-height: 92dvh;
            border-radius: var(--radius-sm);
          }
          .buy-now-header {
            padding: 1rem;
            gap: 0.6rem;
          }
          .buy-now-header h3 {
            font-size: 1.1rem;
          }
          .buy-header-icon {
            width: 36px;
            height: 36px;
          }
          .order-product-summary {
            padding: 0.75rem 1rem;
            gap: 0.75rem;
          }
          .order-product-summary img {
            width: 50px;
            height: 50px;
          }
          .summary-title {
            font-size: 0.9rem;
          }
          .unit-price {
            font-size: 1.05rem;
          }
          .checkout-form {
            padding: 1rem 0.85rem;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .input-with-icon input {
            font-size: 0.8rem;
            padding: 0.6rem 0.75rem 0.6rem 2.1rem;
          }
          .field-icon {
            left: 0.6rem;
          }
          .qr-scanner-card {
            padding: 1rem 0.75rem;
          }
          .qr-scanner-img {
            max-width: 180px;
            width: 100%;
          }
          .upi-id-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            text-align: center;
          }
          .upi-id-content {
            text-align: center;
          }
          .upi-val {
            font-size: 0.75rem;
          }
          .btn-copy-upi {
            width: 100%;
            justify-content: center;
            padding: 0.5rem;
          }
          .app-chips {
            gap: 0.25rem;
          }
          .app-chip {
            font-size: 0.65rem;
            padding: 0.2rem 0.45rem;
          }
          .order-total-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            text-align: center;
          }
          .final-total {
            font-size: 1.4rem;
          }
          .place-order-btn {
            width: 100%;
            justify-content: center;
            padding: 0.85rem;
            font-size: 0.8rem;
          }
          .order-success-view {
            padding: 1.25rem 0.85rem;
          }
          .success-title {
            font-size: 1.2rem;
          }
          .greeting-summary-box {
            padding: 0.85rem;
          }
          .greeting-row {
            font-size: 0.78rem;
          }
          .g-lbl { width: 40%; }
          .g-val { width: 60%; }
          .success-actions-row {
            flex-direction: column;
            gap: 0.6rem;
          }
          .continue-shop-btn, .opt-wa-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ShieldCheck, ShoppingBag, Sparkles, ArrowRight, Zap, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({
  isOpen,
  onClose,
  items, // array of books { book, quantity }
  currentUser,
  onCompletePurchase
}) {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen || !items || items.length === 0) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.book.price * (item.quantity || 1)), 0);
  const totalOriginal = items.reduce((sum, item) => sum + ((item.book.original_price || item.book.price) * (item.quantity || 1)), 0);
  const savings = Math.max(0, totalOriginal - subtotal);

  const handlePay = async () => {
    setIsProcessing(true);

    // Simulate quick network processing
    await new Promise(r => setTimeout(r, 650));

    // Complete purchases for all items
    const createdOrders = [];
    for (const item of items) {
      const order = await onCompletePurchase({
        book: item.book,
        quantity: item.quantity || 1,
        paymentMethod
      });
      createdOrders.push(order);
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#ec4899', '#ef4444', '#facc15'] // Sky blue, Pink, Red, Yellow!
    });

    setIsProcessing(false);
    setCompletedOrder(createdOrders[0]);
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleFinish}>
      <div className="modal-content checkout-modal-box" onClick={(e) => e.stopPropagation()}>
        {completedOrder ? (
          /* Success Screen */
          <div className="order-success-screen">
            <div className="success-icon-pulse">
              <CheckCircle2 size={54} className="text-yellow" />
            </div>
            <h2>Order Confirmed & Payment Received!</h2>
            <p className="order-success-subtitle">
              Thank you, <strong>{currentUser.full_name}</strong>! Your books are now unlocked in your library.
            </p>

            {/* Receipt Summary Card */}
            <div className="receipt-card card-glass">
              <div className="receipt-row">
                <span>Order Reference:</span>
                <strong className="order-num-text">{completedOrder.order_number}</strong>
              </div>
              <div className="receipt-row">
                <span>Buyer User ID:</span>
                <span className="user-id-tag">{currentUser.user_id}</span>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <span className="badge badge-sky">{paymentMethod}</span>
              </div>
              <div className="receipt-row">
                <span>Total Amount Paid:</span>
                <strong className="text-red" style={{ fontSize: '1.2rem' }}>
                  ${subtotal.toFixed(2)}
                </strong>
              </div>
              <div className="receipt-row">
                <span>Items Purchased:</span>
                <span>{items.map(i => i.book.title).join(', ')}</span>
              </div>
            </div>

            <div className="success-action-row">
              <button className="btn btn-yellow btn-lg btn-full" onClick={handleFinish}>
                <Sparkles size={18} />
                <span>Go to My Library & Start Reading</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div className="modal-header">
              <div className="checkout-header-title">
                <ShoppingBag className="text-red" size={22} />
                <h3>Secure Checkout & Purchase</h3>
              </div>
              <button className="icon-close-btn" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="modal-body checkout-body-flow">
              {/* Buyer ID Banner (Specific Requirement) */}
              <div className="buyer-id-banner card-glass">
                <div className="buyer-id-label-col">
                  <span className="buyer-label">Registered Buyer User ID</span>
                  <span className="user-id-tag font-lg">{currentUser.user_id}</span>
                </div>
                <div className="buyer-details-col">
                  <span>Name: <strong>{currentUser.full_name}</strong></span>
                  <span className="text-secondary text-xs">{currentUser.email}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="checkout-items-summary">
                <h5 className="checkout-section-title">Order Items ({items.length})</h5>
                <div className="checkout-items-list">
                  {items.map((item, idx) => (
                    <div key={idx} className="checkout-item-row">
                      <img
                        src={item.book.cover_url}
                        alt={item.book.title}
                        className="checkout-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="checkout-item-info">
                        <span className="checkout-book-title">{item.book.title}</span>
                        <span className="checkout-book-author">By {item.book.author}</span>
                        <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                      <div className="checkout-item-price">
                        <strong className="text-red">
                          ${(item.book.price * (item.quantity || 1)).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-method-section">
                <h5 className="checkout-section-title">Choose Payment Method</h5>
                <div className="payment-options-grid">
                  <label className={`payment-option-card ${paymentMethod === 'Credit Card' ? 'active-payment' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={() => setPaymentMethod('Credit Card')}
                    />
                    <CreditCard size={20} className="text-sky" />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <span className="payment-sub">Visa, Mastercard, Amex</span>
                    </div>
                  </label>

                  <label className={`payment-option-card ${paymentMethod === 'UPI / Instant Pay' ? 'active-payment' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="UPI / Instant Pay"
                      checked={paymentMethod === 'UPI / Instant Pay'}
                      onChange={() => setPaymentMethod('UPI / Instant Pay')}
                    />
                    <Zap size={20} className="text-yellow" />
                    <div>
                      <strong>UPI / Instant Pay</strong>
                      <span className="payment-sub">Google Pay, PhonePe, QR</span>
                    </div>
                  </label>

                  <label className={`payment-option-card ${paymentMethod === 'Cash on Delivery' ? 'active-payment' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                    />
                    <ShieldCheck size={20} className="text-pink" />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <span className="payment-sub">Pay upon physical arrival</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="checkout-totals-card">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="totals-row text-pink font-semibold">
                    <span>Discount Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="totals-row">
                  <span>Sales Tax & Digital License Fee</span>
                  <span className="text-sky">FREE</span>
                </div>
                <div className="totals-divider"></div>
                <div className="totals-row final-total-row">
                  <span>Grand Total</span>
                  <span className="grand-total-amount text-red">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-sky" onClick={onClose} disabled={isProcessing}>
                Cancel
              </button>
              <button
                className="btn btn-red btn-lg"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Confirm & Pay ${subtotal.toFixed(2)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

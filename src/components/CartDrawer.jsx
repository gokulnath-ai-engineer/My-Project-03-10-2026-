import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, BookOpen } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currentUser
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-title-row">
            <ShoppingBag className="text-pink" size={22} />
            <h3>Your Reading Cart ({cartItems.length})</h3>
          </div>
          <button className="icon-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cart-drawer-body">
          {/* Buyer ID Tag notice */}
          <div className="cart-buyer-notice">
            <span>Checking out with Buyer ID:</span>
            <span className="user-id-tag">{currentUser.user_id}</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} className="text-sky" style={{ opacity: 0.4 }} />
              <h4>Your cart is empty</h4>
              <p>Explore our curated books in Sci-Fi, Tech, Fiction, and more.</p>
              <button className="btn btn-sky btn-sm" onClick={onClose}>
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.book.id} className="cart-item-card">
                  <img
                    src={item.book.cover_url}
                    alt={item.book.title}
                    className="cart-item-thumb"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-title">{item.book.title}</span>
                    <span className="cart-item-author">By {item.book.author}</span>
                    <span className="cart-item-price text-red">
                      ${Number(item.book.price).toFixed(2)}
                    </span>

                    <div className="cart-qty-row">
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.book.id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.book.id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal:</span>
              <strong className="text-red" style={{ fontSize: '1.25rem' }}>
                ${subtotal.toFixed(2)}
              </strong>
            </div>
            <button
              className="btn btn-red btn-lg btn-full"
              onClick={() => {
                onClose();
                onCheckout();
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

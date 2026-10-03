import React from 'react';
import { X, Star, BookOpen, ShoppingBag, ShoppingCart, CheckCircle, ShieldAlert, Tag, Globe, FileText, CheckCircle2 } from 'lucide-react';

export default function BookDetailModal({
  isOpen,
  onClose,
  book,
  isPurchased,
  currentUser,
  onOpenReader,
  onBuyNow,
  onAddToCart
}) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="detail-header-badges">
            <span className="badge badge-sky">{book.category}</span>
            {isPurchased && (
              <span className="badge badge-yellow">
                <CheckCircle2 size={13} /> You Own This Book
              </span>
            )}
          </div>
          <button className="icon-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body book-detail-grid">
          {/* Left Column: Cover & Quick Actions */}
          <div className="detail-cover-col">
            <div className="detail-img-box">
              <img
                src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={book.title}
                className="detail-cover-img"
              />
            </div>

            <div className="detail-quick-actions">
              <button
                className="btn btn-outline-sky btn-full"
                onClick={() => {
                  onClose();
                  onOpenReader(book, isPurchased);
                }}
              >
                <BookOpen size={18} />
                <span>{isPurchased ? 'Read Full Book' : 'Read Sample Preview'}</span>
              </button>

              {!isPurchased && (
                <>
                  <button
                    className="btn btn-red btn-full"
                    onClick={() => {
                      onClose();
                      onBuyNow(book);
                    }}
                    disabled={book.stock <= 0}
                  >
                    <ShoppingBag size={18} />
                    <span>Buy Now for ${Number(book.price).toFixed(2)}</span>
                  </button>

                  <button
                    className="btn btn-outline-pink btn-full"
                    onClick={() => {
                      onAddToCart(book);
                    }}
                    disabled={book.stock <= 0}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Details & Specs */}
          <div className="detail-info-col">
            <h2 className="detail-title">{book.title}</h2>
            <p className="detail-author">By <strong>{book.author}</strong></p>

            <div className="detail-rating-row">
              <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(book.rating || 5) ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="rating-num">{(book.rating || 4.9).toFixed(1)} / 5.0</span>
              <span className="bullet-dot">•</span>
              <span className="reviews-tag">Verified Reader Reviews</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price text-red">${Number(book.price).toFixed(2)}</span>
              {book.original_price > book.price && (
                <>
                  <span className="original-price">${Number(book.original_price).toFixed(2)}</span>
                  <span className="badge badge-red">
                    Save ${(book.original_price - book.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="detail-description">
              <h5>Book Overview</h5>
              <p>{book.description}</p>
            </div>

            <div className="detail-specs-grid">
              <div className="spec-card">
                <FileText size={18} className="text-sky" />
                <span className="spec-label">Pages</span>
                <span className="spec-value">{book.pages || 320} Pages</span>
              </div>
              <div className="spec-card">
                <Globe size={18} className="text-pink" />
                <span className="spec-label">Language</span>
                <span className="spec-value">{book.language || 'English'}</span>
              </div>
              <div className="spec-card">
                <Tag size={18} className="text-yellow" />
                <span className="spec-label">Stock Status</span>
                <span className="spec-value">{book.stock > 0 ? `${book.stock} Available` : 'Sold Out'}</span>
              </div>
            </div>

            {/* Buyer notice */}
            <div className="buyer-session-note">
              <span>Ordering as: <strong>{currentUser.full_name}</strong></span>
              <span className="user-id-tag">{currentUser.user_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, BookOpen, Sun, Moon, Sparkles, ShoppingBag, ZoomIn, ZoomOut, CheckCircle2, Bookmark } from 'lucide-react';

export default function BookReaderModal({
  isOpen,
  onClose,
  book,
  isPurchased,
  currentUser,
  onBuyNow
}) {
  const [fontSize, setFontSize] = useState(18);
  const [readerTheme, setReaderTheme] = useState('sky'); // 'sky' | 'warm' | 'night'
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isOpen || !book) return null;

  const canReadFull = isPurchased || currentUser.role === 'admin';
  const readerContent = canReadFull
    ? (book.full_content || book.preview_content || 'Full content text loading...')
    : (book.preview_content || 'Sample preview chapter loading...');

  return (
    <div className="modal-overlay reader-modal-overlay" onClick={onClose}>
      <div className={`modal-content reader-modal-content theme-${readerTheme}`} onClick={(e) => e.stopPropagation()}>
        {/* Reader Topbar */}
        <div className="reader-topbar">
          <div className="reader-book-meta">
            <BookOpen className="text-sky" size={20} />
            <div>
              <h3 className="reader-title">{book.title}</h3>
              <span className="reader-author">By {book.author}</span>
            </div>
            {canReadFull ? (
              <span className="badge badge-yellow">
                <CheckCircle2 size={12} /> Full Edition Unlocked
              </span>
            ) : (
              <span className="badge badge-pink">
                Sample Excerpt Preview
              </span>
            )}
          </div>

          <div className="reader-controls">
            {/* Theme switcher */}
            <div className="theme-toggle-group">
              <button
                className={`theme-btn theme-sky-btn ${readerTheme === 'sky' ? 'active-theme' : ''}`}
                onClick={() => setReaderTheme('sky')}
                title="Sky Day Theme"
              >
                Sky
              </button>
              <button
                className={`theme-btn theme-warm-btn ${readerTheme === 'warm' ? 'active-theme' : ''}`}
                onClick={() => setReaderTheme('warm')}
                title="Warm Yellow Paper"
              >
                Warm
              </button>
              <button
                className={`theme-btn theme-night-btn ${readerTheme === 'night' ? 'active-theme' : ''}`}
                onClick={() => setReaderTheme('night')}
                title="Night Sky Dark"
              >
                Night
              </button>
            </div>

            {/* Font size adjustments */}
            <div className="font-controls">
              <button
                className="icon-ctrl-btn"
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                title="Decrease font size"
              >
                <ZoomOut size={16} />
              </button>
              <span className="font-size-label">{fontSize}px</span>
              <button
                className="icon-ctrl-btn"
                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                title="Increase font size"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Bookmark button */}
            <button 
              className={`icon-ctrl-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
            >
              <Bookmark size={18} fill={isBookmarked ? '#facc15' : 'none'} />
            </button>

            {/* Close Button */}
            <button className="icon-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Reader Body Text */}
        <div className="reader-body">
          <div className="reader-text-container" style={{ fontSize: `${fontSize}px` }}>
            {readerContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="reader-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* If preview mode, show CTA at the bottom */}
          {!canReadFull && (
            <div className="reader-preview-cta card-glass">
              <div className="cta-left">
                <Sparkles className="text-yellow" size={28} />
                <div>
                  <h4>Finished Sample Preview</h4>
                  <p>Unlock all {book.pages || 350} pages and read the complete edition anytime from your library!</p>
                </div>
              </div>
              <div className="cta-right">
                <div className="cta-price">
                  <span className="cta-price-amount text-red">${Number(book.price).toFixed(2)}</span>
                  {book.original_price > book.price && (
                    <span className="original-price">${Number(book.original_price).toFixed(2)}</span>
                  )}
                </div>
                <button
                  className="btn btn-red"
                  onClick={() => {
                    onClose();
                    onBuyNow(book);
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Buy Book to Continue</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reader Footer */}
        <div className="reader-footer">
          <span>Viewing: {book.title}</span>
          <span>{canReadFull ? `Complete Edition (${book.pages || 320} Pages)` : 'Sample Chapter Preview'}</span>
          <span className="buyer-stamp">Reader: {currentUser.full_name} ({currentUser.user_id})</span>
        </div>
      </div>
    </div>
  );
}

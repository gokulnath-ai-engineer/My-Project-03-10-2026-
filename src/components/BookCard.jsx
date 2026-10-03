import React from 'react';
import { Star, BookOpen, ShoppingBag, ShoppingCart, Trash2, Edit3, CheckCircle, Flame } from 'lucide-react';

export default function BookCard({
  book,
  currentUser,
  isPurchased,
  onOpenReader,
  onOpenDetail,
  onAddToCart,
  onBuyNow,
  onEditBook,
  onDeleteBook
}) {
  const discountPercent = book.original_price && book.original_price > book.price
    ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
    : 0;

  return (
    <div className="book-card card-glass">
      {/* Top badges */}
      <div className="book-card-top-badges">
        <span className="badge badge-sky">{book.category}</span>
        {discountPercent > 0 && (
          <span className="badge badge-red discount-pill">
            <Flame size={12} /> {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Book Cover */}
      <div className="book-cover-wrapper" onClick={() => onOpenDetail(book)}>
        <img
          src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={book.title}
          className="book-cover-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="book-cover-overlay">
          <span>Click to Inspect</span>
        </div>
      </div>

      {/* Book Info */}
      <div className="book-card-body">
        <div className="book-rating-row">
          <div className="stars-container">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(book.rating || 5) ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span className="rating-value">{book.rating || '4.8'}</span>
          </div>
          <span className="pages-text">{book.pages || 320} pages</span>
        </div>

        <h4 className="book-title" onClick={() => onOpenDetail(book)} title={book.title}>
          {book.title}
        </h4>
        <p className="book-author">By {book.author}</p>

        {/* Stock status */}
        <div className="stock-status-row">
          {book.stock > 0 ? (
            <span className="stock-badge stock-available">
              ● In Stock ({book.stock} left)
            </span>
          ) : (
            <span className="stock-badge stock-out">
              ● Out of Stock
            </span>
          )}
        </div>

        {/* Price Row */}
        <div className="book-price-row">
          <div className="price-box">
            <span className="current-price text-red">${Number(book.price).toFixed(2)}</span>
            {book.original_price > book.price && (
              <span className="original-price">${Number(book.original_price).toFixed(2)}</span>
            )}
          </div>

          {isPurchased && (
            <span className="badge badge-yellow purchased-indicator">
              <CheckCircle size={13} /> Owned
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="book-card-actions">
          {isPurchased ? (
            <button
              className="btn btn-yellow btn-sm btn-full"
              onClick={() => onOpenReader(book, true)}
            >
              <BookOpen size={16} />
              <span>Read Full Book</span>
            </button>
          ) : (
            <>
              <button
                className="btn btn-outline-sky btn-sm"
                onClick={() => onOpenReader(book, false)}
                title="Read Sample Preview"
              >
                <BookOpen size={15} />
                <span>Read Sample</span>
              </button>

              <button
                className="btn btn-red btn-sm"
                onClick={() => onBuyNow(book)}
                disabled={book.stock <= 0}
                title="Buy Now with Instant Checkout"
              >
                <ShoppingBag size={15} />
                <span>Buy Now</span>
              </button>

              <button
                className="btn btn-outline-pink btn-icon-only btn-sm"
                onClick={() => onAddToCart(book)}
                disabled={book.stock <= 0}
                title="Add to Cart"
              >
                <ShoppingCart size={15} />
              </button>
            </>
          )}
        </div>

        {/* Admin Controls */}
        {currentUser.role === 'admin' && (
          <div className="admin-card-actions">
            <span className="admin-ctrl-label">Admin Controls:</span>
            <div className="admin-btn-group">
              <button
                className="btn btn-sm btn-outline-sky"
                onClick={() => onEditBook(book)}
                title="Edit Book Details"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                className="btn btn-sm btn-outline-red"
                onClick={() => onDeleteBook(book.id)}
                title="Delete Book"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

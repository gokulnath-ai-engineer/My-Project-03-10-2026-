import React from 'react';
import { BookOpen, Receipt, Sparkles, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function UserLibraryView({
  currentUser,
  books,
  userLibrary,
  sales,
  onOpenReader,
  onExploreStore
}) {
  // Purchased books
  const purchasedBookIds = new Set(userLibrary.map(item => item.book_id));
  const myBooks = books.filter(b => purchasedBookIds.has(b.id));

  // User's specific sales history
  const mySalesHistory = sales.filter(s => s.buyer_user_id === currentUser.user_id);

  return (
    <div className="user-library-container">
      {/* User Hero Banner */}
      <div className="library-hero-card card-glass">
        <div className="library-hero-left">
          <div className="library-badge-row">
            <span className="badge badge-sky">Reader Portal</span>
            <span className="user-id-tag">Buyer User ID: {currentUser.user_id}</span>
          </div>
          <h2>Welcome to Your Personal Book Shelf</h2>
          <p>
            Hello, <strong>{currentUser.full_name}</strong>! Read full editions of your purchased books, track order receipts, and expand your digital library.
          </p>
        </div>

        <div className="library-quick-stats">
          <div className="lib-stat-box bg-sky-light">
            <BookOpen size={24} className="text-sky" />
            <div className="stat-data">
              <span className="stat-num text-sky">{myBooks.length}</span>
              <span className="stat-label">Owned Books</span>
            </div>
          </div>

          <div className="lib-stat-box bg-pink-light">
            <Receipt size={24} className="text-pink" />
            <div className="stat-data">
              <span className="stat-num text-pink">{mySalesHistory.length}</span>
              <span className="stat-label">Orders Placed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookshelf Section */}
      <div className="library-section">
        <div className="section-header">
          <div className="title-with-icon">
            <BookOpen className="text-sky" size={24} />
            <div>
              <h3>My Reading Shelf ({myBooks.length})</h3>
              <span className="subtitle">Full book contents unlocked for online reading.</span>
            </div>
          </div>

          <button className="btn btn-outline-pink btn-sm" onClick={onExploreStore}>
            <ShoppingBag size={16} />
            <span>Browse More Books</span>
          </button>
        </div>

        {myBooks.length === 0 ? (
          <div className="empty-shelf-card card-glass">
            <Sparkles size={40} className="text-yellow" />
            <h4>Your Bookshelf is Waiting!</h4>
            <p>You haven't bought any books yet. Browse the catalog to read free sample previews or purchase any title.</p>
            <button className="btn btn-yellow" onClick={onExploreStore}>
              <span>Explore Book Store</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {myBooks.map(book => (
              <div key={book.id} className="book-card card-glass">
                <div className="book-card-top-badges">
                  <span className="badge badge-sky">{book.category}</span>
                  <span className="badge badge-yellow">
                    <CheckCircle2 size={12} /> Owned
                  </span>
                </div>

                <div className="book-cover-wrapper" onClick={() => onOpenReader(book, true)}>
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="book-cover-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="book-cover-overlay">
                    <span>Click to Open Reader</span>
                  </div>
                </div>

                <div className="book-card-body">
                  <h4 className="book-title" onClick={() => onOpenReader(book, true)}>
                    {book.title}
                  </h4>
                  <p className="book-author">By {book.author}</p>
                  <p className="book-pages-sub">{book.pages || 320} Pages • {book.language || 'English'}</p>

                  <div className="book-card-actions">
                    <button
                      className="btn btn-yellow btn-full"
                      onClick={() => onOpenReader(book, true)}
                    >
                      <BookOpen size={16} />
                      <span>Read Full Book</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's Order & Sales History with User ID */}
      <div className="library-section">
        <div className="section-header">
          <div className="title-with-icon">
            <Receipt className="text-pink" size={24} />
            <div>
              <h3>My Orders & Purchase Receipts</h3>
              <span className="subtitle">
                Sales history registered under your Buyer User ID: <strong>{currentUser.user_id}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Buyer User ID</th>
                <th>Purchased Title</th>
                <th>Quantity</th>
                <th>Total Paid</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mySalesHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No purchase history found for your account ID yet.
                  </td>
                </tr>
              ) : (
                mySalesHistory.map(sale => (
                  <tr key={sale.id}>
                    <td><strong className="order-num-text">{sale.order_number}</strong></td>
                    <td>
                      <span className="user-id-tag">{sale.buyer_user_id}</span>
                    </td>
                    <td>
                      <div className="book-title-cell">
                        <BookOpen size={14} className="text-sky" />
                        <span>{sale.book_title}</span>
                      </div>
                    </td>
                    <td>{sale.quantity || 1}</td>
                    <td>
                      <strong className="text-red">
                        ${Number(sale.total_amount || sale.price).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-sky">{sale.payment_method || 'Card'}</span>
                    </td>
                    <td className="text-xs">
                      {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <span className="badge badge-yellow">
                        <CheckCircle2 size={12} /> {sale.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

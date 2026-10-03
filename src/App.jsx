import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  ShoppingBag, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import './App.css';

import { supabaseService, DEMO_USERS } from './services/supabaseService';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import BookReaderModal from './components/BookReaderModal';
import BookDetailModal from './components/BookDetailModal';
import AdminDashboard from './components/AdminDashboard';
import UserLibraryView from './components/UserLibraryView';
import CheckoutModal from './components/CheckoutModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';

const CATEGORIES = ['All', 'Technology', 'Sci-Fi', 'Fiction', 'Business', 'Fantasy'];

export default function App() {
  // --- Global App State ---
  const [currentUser, setCurrentUser] = useState(() => supabaseService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'admin' | 'library'
  const [books, setBooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filtering & Sorting ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // --- Modals State ---
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState(null);
  const [isReaderFull, setIsReaderFull] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailBook, setDetailBook] = useState(null);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'sky') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedBooks = await supabaseService.getBooks();
      setBooks(fetchedBooks);

      const fetchedSales = await supabaseService.getSales();
      setSales(fetchedSales);

      if (currentUser?.user_id) {
        const lib = supabaseService.getUserLibrary(currentUser.user_id);
        setUserLibrary(lib);
      }

      setIsSupabaseConfigured(supabaseService.isConfigured);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Handle Login & Role change
  const handleLogin = (user) => {
    supabaseService.setCurrentUser(user);
    setCurrentUser(user);
    setUserLibrary(supabaseService.getUserLibrary(user.user_id));
    addToast(`Logged in as ${user.full_name} (${user.role.toUpperCase()}) - ID: ${user.user_id}`, 'pink');
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('store');
    }
  };

  const handleLogout = () => {
    supabaseService.logout();
    const guestUser = {
      user_id: 'USR-GUEST',
      full_name: 'Guest Reader',
      email: 'guest@reader.com',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
    };
    setCurrentUser(guestUser);
    setActiveTab('store');
    addToast('Logged out of session', 'yellow');
  };

  // Cart Handlers
  const handleAddToCart = (book) => {
    if (book.stock <= 0) {
      addToast('Sorry, this book is currently out of stock!', 'red');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
    addToast(`"${book.title}" added to your cart!`, 'sky');
  };

  const handleUpdateCartQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(bookId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.book.id === bookId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.book.id !== bookId));
    addToast('Item removed from cart', 'red');
  };

  // Direct Buy Now (Single Book)
  const handleBuyNow = (book) => {
    if (book.stock <= 0) {
      addToast('This book is currently out of stock!', 'red');
      return;
    }
    setCheckoutItems([{ book, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  // Cart Checkout
  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutItems(cart);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Purchase Execution
  const handleCompletePurchase = async ({ book, quantity, paymentMethod }) => {
    const saleRecord = await supabaseService.recordSale({
      user: currentUser,
      book,
      paymentMethod,
      quantity
    });

    // Refresh books and sales
    await loadData();

    // Remove from cart if present
    setCart(prev => prev.filter(item => item.book.id !== book.id));

    addToast(`Order confirmed! Buyer ID: ${currentUser.user_id}`, 'yellow');
    return saleRecord;
  };

  // Book Reader Handlers
  const handleOpenReader = (book, isFullEdition = false) => {
    setReaderBook(book);
    setIsReaderFull(isFullEdition);
    setIsReaderOpen(true);
  };

  // Book Detail Handler
  const handleOpenDetail = (book) => {
    setDetailBook(book);
    setIsDetailOpen(true);
  };

  // Admin Book Operations
  const handleAddBook = async (newBook) => {
    await supabaseService.addBook(newBook);
    await loadData();
    addToast(`Published "${newBook.title}" to catalog & Supabase DB!`, 'sky');
  };

  const handleUpdateBook = async (id, updatedFields) => {
    await supabaseService.updateBook(id, updatedFields);
    await loadData();
    addToast('Product updated successfully!', 'pink');
  };

  const handleDeleteBook = async (id) => {
    await supabaseService.deleteBook(id);
    await loadData();
    addToast('Product deleted from database', 'red');
  };

  // Filtered & Sorted Books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured default
    });

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        onLogout={handleLogout}
        isSupabaseConfigured={isSupabaseConfigured}
      />

      <main className="main-content">
        {/* =====================================================================
            VIEW 1: STOREFRONT & CATALOGUE
            ===================================================================== */}
        {activeTab === 'store' && (
          <div className="store-view">
            {/* Store Hero Banner */}
            <div className="store-hero-banner">
              <div className="hero-content">
                <div className="hero-tag-row">
                  <span className="badge badge-sky">
                    <Sparkles size={12} /> Supabase PostgreSQL Connected
                  </span>
                  <span className="badge badge-pink">
                    <Flame size={12} /> New Releases & Sale Discounts
                  </span>
                </div>
                <h1>Explore Inspiring Books & Read Online</h1>
                <p className="hero-subtitle">
                  Browse science fiction, tech engineering, literature, and business. Sample preview chapters for free or purchase instant full editions.
                </p>
                <div className="hero-cta-buttons">
                  <button
                    className="btn btn-red btn-lg"
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Browse Books</span>
                  </button>

                  {currentUser.role === 'admin' ? (
                    <button className="btn btn-pink btn-lg" onClick={() => setActiveTab('admin')}>
                      <ShieldCheck size={18} />
                      <span>Admin Control Center</span>
                    </button>
                  ) : (
                    <button className="btn btn-outline-sky btn-lg" onClick={() => setActiveTab('library')}>
                      <BookOpen size={18} />
                      <span>My Reading Shelf</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hero highlight badge */}
              <div className="hero-stat-badge">
                <Sparkles size={32} className="stat-glow-star" />
                <span className="stat-bold">{books.length} Books</span>
                <span className="stat-caption">Instant Reader Ready</span>
              </div>
            </div>

            {/* Catalog Controls */}
            <div id="catalog-section" className="store-controls-card card-glass">
              <div className="search-filter-row">
                <div className="store-search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search by book title, author, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="sort-select-box">
                  <SlidersHorizontal size={16} />
                  <span>Sort by:</span>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="category-pills-row">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    className={`category-pill ${selectedCategory === category ? 'active-category' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Cards Grid */}
            <div className="books-grid">
              {filteredBooks.length === 0 ? (
                <div className="empty-shelf-card card-glass" style={{ gridColumn: '1 / -1' }}>
                  <Search size={40} className="text-sky" />
                  <h4>No books found</h4>
                  <p>Try searching for a different keyword or select another genre category.</p>
                </div>
              ) : (
                filteredBooks.map(book => {
                  const isPurchased = supabaseService.isBookPurchased(currentUser.user_id, book.id);
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      currentUser={currentUser}
                      isPurchased={isPurchased}
                      onOpenReader={handleOpenReader}
                      onOpenDetail={handleOpenDetail}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onEditBook={() => {
                        setActiveTab('admin');
                      }}
                      onDeleteBook={handleDeleteBook}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 2: ADMIN DASHBOARD (ADMIN ONLY)
            ===================================================================== */}
        {activeTab === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard
              books={books}
              sales={sales}
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
              currentUser={currentUser}
            />
          ) : (
            <div className="empty-shelf-card card-glass">
              <ShieldCheck size={48} className="text-red" />
              <h3>Admin Access Restricted</h3>
              <p>You are currently logged in as a Customer (User ID: {currentUser.user_id}). Only Administrators can add books and view global sales records.</p>
              <button 
                className="btn btn-pink" 
                onClick={() => handleLogin(DEMO_USERS.admin)}
              >
                Switch to Admin Demo Account (ADM-001)
              </button>
            </div>
          )
        )}

        {/* =====================================================================
            VIEW 3: USER LIBRARY & PURCHASES (USER PORTAL)
            ===================================================================== */}
        {activeTab === 'library' && (
          <UserLibraryView
            currentUser={currentUser}
            books={books}
            userLibrary={userLibrary}
            sales={sales}
            onOpenReader={handleOpenReader}
            onExploreStore={() => setActiveTab('store')}
          />
        )}
      </main>

      {/* =======================================================================
          MODALS & OVERLAYS
          ======================================================================= */}
      {/* Book Reader Modal */}
      <BookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={readerBook}
        isPurchased={isReaderFull}
        currentUser={currentUser}
        onBuyNow={(book) => {
          setIsReaderOpen(false);
          handleBuyNow(book);
        }}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        book={detailBook}
        isPurchased={detailBook ? supabaseService.isBookPurchased(currentUser.user_id, detailBook.id) : false}
        currentUser={currentUser}
        onOpenReader={handleOpenReader}
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCartCheckout}
        currentUser={currentUser}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems}
        currentUser={currentUser}
        onCompletePurchase={handleCompletePurchase}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
        isConfigured={isSupabaseConfigured}
        onConfigUpdated={() => {
          loadData();
          addToast('Supabase settings updated & re-synchronized', 'sky');
        }}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Sparkles size={16} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

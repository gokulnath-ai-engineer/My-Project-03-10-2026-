import React, { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  Receipt, 
  BarChart3, 
  Trash2, 
  Edit3, 
  Search, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  BookOpen
} from 'lucide-react';

const COVER_PRESETS = [
  { name: 'Tech / Modern', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sci-Fi / Space', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
  { name: 'Classic / Fiction', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Business / Finance', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fantasy / Magic', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80' }
];

export default function AdminDashboard({
  books,
  sales,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  currentUser
}) {
  const [adminTab, setAdminTab] = useState('add'); // 'add' | 'products' | 'sales' | 'analytics'
  const [salesSearch, setSalesSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Form State for Adding / Editing Books
  const [editingBookId, setEditingBookId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Technology',
    price: '29.99',
    original_price: '39.99',
    stock: '25',
    pages: '350',
    cover_url: COVER_PRESETS[0].url,
    description: '',
    preview_content: '',
    full_content: ''
  });

  const [formSuccess, setFormSuccess] = useState('');

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price) {
      alert('Please fill in Title, Author and Price');
      return;
    }

    if (editingBookId) {
      onUpdateBook(editingBookId, {
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        stock: parseInt(formData.stock, 10),
        pages: parseInt(formData.pages, 10)
      });
      setFormSuccess(`Book "${formData.title}" updated successfully!`);
      setEditingBookId(null);
    } else {
      onAddBook({
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        stock: parseInt(formData.stock, 10),
        pages: parseInt(formData.pages, 10),
        preview_content: formData.preview_content || `Chapter 1: The Opening\n\nPreview text for ${formData.title}...`,
        full_content: formData.full_content || `Chapter 1: The Opening\n\nFull reader text for ${formData.title}...`
      });
      setFormSuccess(`New Book "${formData.title}" added to inventory & Supabase DB!`);
    }

    // Reset Form
    setFormData({
      title: '',
      author: '',
      category: 'Technology',
      price: '29.99',
      original_price: '39.99',
      stock: '25',
      pages: '350',
      cover_url: COVER_PRESETS[0].url,
      description: '',
      preview_content: '',
      full_content: ''
    });

    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price.toString(),
      original_price: (book.original_price || book.price).toString(),
      stock: (book.stock || 10).toString(),
      pages: (book.pages || 320).toString(),
      cover_url: book.cover_url || COVER_PRESETS[0].url,
      description: book.description || '',
      preview_content: book.preview_content || '',
      full_content: book.full_content || ''
    });
    setAdminTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingBookId(null);
    setFormData({
      title: '',
      author: '',
      category: 'Technology',
      price: '29.99',
      original_price: '39.99',
      stock: '25',
      pages: '350',
      cover_url: COVER_PRESETS[0].url,
      description: '',
      preview_content: '',
      full_content: ''
    });
  };

  // Filtered Sales
  const filteredSales = sales.filter(s => {
    const query = salesSearch.toLowerCase();
    return (
      (s.buyer_user_id && s.buyer_user_id.toLowerCase().includes(query)) ||
      (s.order_number && s.order_number.toLowerCase().includes(query)) ||
      (s.buyer_name && s.buyer_name.toLowerCase().includes(query)) ||
      (s.book_title && s.book_title.toLowerCase().includes(query))
    );
  });

  // Filtered Inventory
  const filteredInventory = books.filter(b => {
    const query = inventorySearch.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
  });

  // Analytics calculation
  const totalRevenue = sales.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);
  const totalUnitsSold = sales.reduce((acc, curr) => acc + (parseInt(curr.quantity, 10) || 1), 0);
  const uniqueBuyers = new Set(sales.map(s => s.buyer_user_id)).size;

  return (
    <div className="admin-dashboard-container">
      {/* Admin Top Header */}
      <div className="admin-header-card card-glass">
        <div className="admin-header-left">
          <div className="admin-badge-row">
            <span className="badge badge-pink">Administrator Portal</span>
            <span className="user-id-tag">Admin: {currentUser.user_id}</span>
          </div>
          <h2>Admin Management & Control Center</h2>
          <p>Exclusively add books, manage catalog inventory, and inspect sales & buyer records with User IDs.</p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-nav-pills">
          <button
            className={`admin-pill-btn ${adminTab === 'add' ? 'active-pill-pink' : ''}`}
            onClick={() => setAdminTab('add')}
          >
            <PlusCircle size={16} />
            <span>{editingBookId ? 'Edit Book' : 'Add New Book'}</span>
          </button>
          <button
            className={`admin-pill-btn ${adminTab === 'products' ? 'active-pill-sky' : ''}`}
            onClick={() => setAdminTab('products')}
          >
            <Package size={16} />
            <span>Products & Stock ({books.length})</span>
          </button>
          <button
            className={`admin-pill-btn ${adminTab === 'sales' ? 'active-pill-yellow' : ''}`}
            onClick={() => setAdminTab('sales')}
          >
            <Receipt size={16} />
            <span>Sales & Buyers History ({sales.length})</span>
          </button>
          <button
            className={`admin-pill-btn ${adminTab === 'analytics' ? 'active-pill-red' : ''}`}
            onClick={() => setAdminTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>Sales Analytics</span>
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={18} />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: ADD / EDIT BOOK (ADMIN ONLY)
          ========================================================================= */}
      {adminTab === 'add' && (
        <div className="admin-section-card card-glass">
          <div className="section-title-row">
            <div className="title-with-icon">
              <PlusCircle className="text-pink" size={24} />
              <div>
                <h3>{editingBookId ? 'Update Existing Book' : 'Add New Book / Product'}</h3>
                <span className="subtitle">Only administrators can add new products to the Supabase store.</span>
              </div>
            </div>
            {editingBookId && (
              <button className="btn btn-sm btn-outline-red" onClick={cancelEdit}>
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="admin-form-grid">
            {/* Title & Author */}
            <div className="form-group grid-col-2">
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Quantum Frontiers: The New Science"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group grid-col-2">
              <label className="form-label">Author Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Prof. David Harrison"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            {/* Category & Stock */}
            <div className="form-group">
              <label className="form-label">Genre / Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Technology">Technology & Code</option>
                <option value="Sci-Fi">Science Fiction</option>
                <option value="Fiction">Fiction & Literature</option>
                <option value="Business">Business & Economics</option>
                <option value="Fantasy">Fantasy & Magic</option>
                <option value="Education">Education & Learning</option>
                <option value="Self-Help">Self-Help & Growth</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Inventory Stock Units</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            {/* Price & Original Price */}
            <div className="form-group">
              <label className="form-label">Selling Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="24.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price / MSRP ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="34.99"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
              />
            </div>

            {/* Pages & Language */}
            <div className="form-group">
              <label className="form-label">Total Pages</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              />
            </div>

            {/* Cover URL */}
            <div className="form-group grid-col-full">
              <label className="form-label">Book Cover Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.cover_url}
                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              />
              <div className="preset-cover-row">
                <span className="preset-label">Quick Cover Presets:</span>
                {COVER_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-sm btn-outline-sky preset-btn"
                    onClick={() => setFormData({ ...formData, cover_url: p.url })}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group grid-col-full">
              <label className="form-label">Synopsis / Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Provide a compelling summary of the book..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Preview Content */}
            <div className="form-group grid-col-full">
              <label className="form-label">Sample Excerpt / Preview Chapter (Public for all users)</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Chapter 1 sample excerpt that non-paying readers can preview..."
                value={formData.preview_content}
                onChange={(e) => setFormData({ ...formData, preview_content: e.target.value })}
              />
            </div>

            {/* Full Content */}
            <div className="form-group grid-col-full">
              <label className="form-label">Full Book Content (Unlocked only for paying buyers)</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Complete book chapters and text for readers who buy the book..."
                value={formData.full_content}
                onChange={(e) => setFormData({ ...formData, full_content: e.target.value })}
              />
            </div>

            <div className="form-submit-row grid-col-full">
              <button type="submit" className="btn btn-pink btn-lg">
                <PlusCircle size={20} />
                <span>{editingBookId ? 'Save Changes' : 'Publish Book to Store & Supabase'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRODUCTS & INVENTORY MANAGEMENT
          ========================================================================= */}
      {adminTab === 'products' && (
        <div className="admin-section-card card-glass">
          <div className="section-title-row">
            <div className="title-with-icon">
              <Package className="text-sky" size={24} />
              <div>
                <h3>Inventory & Product Catalog</h3>
                <span className="subtitle">Manage stock levels, update pricing, or edit product details.</span>
              </div>
            </div>

            {/* Search */}
            <div className="search-input-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Filter by title or author..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
              />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Pages</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(book => (
                  <tr key={book.id}>
                    <td>
                      <div className="table-book-info">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="table-cover-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div>
                          <strong className="table-title">{book.title}</strong>
                          <span className="table-author">{book.author}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sky">{book.category}</span>
                    </td>
                    <td>
                      <strong className="text-red">${Number(book.price).toFixed(2)}</strong>
                    </td>
                    <td>
                      <div className="stock-control-cell">
                        <button
                          className="btn-stock-adjust"
                          onClick={() => onUpdateBook(book.id, { stock: Math.max(0, (book.stock || 0) - 1) })}
                          title="Decrease Stock"
                        >
                          -
                        </button>
                        <span className={`stock-number ${book.stock <= 5 ? 'text-red font-bold' : ''}`}>
                          {book.stock || 0}
                        </span>
                        <button
                          className="btn-stock-adjust"
                          onClick={() => onUpdateBook(book.id, { stock: (book.stock || 0) + 1 })}
                          title="Increase Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{book.pages || 320} p</td>
                    <td>⭐ {book.rating || 4.8}</td>
                    <td>
                      <div className="action-buttons-cell">
                        <button
                          className="btn btn-sm btn-outline-sky"
                          onClick={() => handleEditClick(book)}
                          title="Edit Book"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-red"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
                              onDeleteBook(book.id);
                            }
                          }}
                          title="Delete Book"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SALES & BUYERS HISTORY (WITH USER ID MENTIONED)
          ========================================================================= */}
      {adminTab === 'sales' && (
        <div className="admin-section-card card-glass">
          <div className="section-title-row">
            <div className="title-with-icon">
              <Receipt className="text-yellow" size={24} />
              <div>
                <h3>History of Book Sales & Buyers</h3>
                <span className="subtitle">
                  Verified sales transactions tracking Buyer User IDs, amounts, and dates.
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="search-input-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search Buyer User ID, Order #..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Buyer User ID</th>
                  <th>Buyer Details</th>
                  <th>Book Title</th>
                  <th>Price & Qty</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Sale Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                      No sales found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <strong className="order-num-text">{sale.order_number}</strong>
                      </td>
                      <td>
                        {/* Requirement: Buyer User ID to mention */}
                        <span className="user-id-tag">
                          {sale.buyer_user_id || 'USR-UNKNOWN'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong>{sale.buyer_name}</strong>
                          <div className="text-secondary text-xs">{sale.buyer_email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="book-title-cell" title={sale.book_title}>
                          <BookOpen size={14} className="text-sky" />
                          <span>{sale.book_title}</span>
                        </div>
                      </td>
                      <td>
                        ${Number(sale.price).toFixed(2)} × {sale.quantity || 1}
                      </td>
                      <td>
                        <strong className="text-red">
                          ${Number(sale.total_amount || (sale.price * (sale.quantity || 1))).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <span className="badge badge-sky">{sale.payment_method || 'Card'}</span>
                      </td>
                      <td className="text-xs">
                        {sale.sale_date ? new Date(sale.sale_date).toLocaleString() : 'Recent'}
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
      )}

      {/* =========================================================================
          TAB 4: SALES ANALYTICS
          ========================================================================= */}
      {adminTab === 'analytics' && (
        <div className="admin-analytics-view">
          {/* Key Metric Cards */}
          <div className="metrics-grid">
            <div className="metric-card card-glass">
              <div className="metric-icon-box bg-red-light">
                <DollarSign className="text-red" size={26} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Total Revenue</span>
                <span className="metric-value text-red">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>

            <div className="metric-card card-glass">
              <div className="metric-icon-box bg-sky-light">
                <ShoppingBag className="text-sky" size={26} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Total Units Sold</span>
                <span className="metric-value text-sky">{totalUnitsSold}</span>
              </div>
            </div>

            <div className="metric-card card-glass">
              <div className="metric-icon-box bg-pink-light">
                <Users className="text-pink" size={26} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Unique Buyers</span>
                <span className="metric-value text-pink">{uniqueBuyers}</span>
              </div>
            </div>

            <div className="metric-card card-glass">
              <div className="metric-icon-box bg-yellow-light">
                <Package className="text-yellow" size={26} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Active Catalog Titles</span>
                <span className="metric-value text-yellow">{books.length}</span>
              </div>
            </div>
          </div>

          {/* Detailed summary breakdown */}
          <div className="analytics-details-grid">
            <div className="analytics-card card-glass">
              <h4>Top Buyers by Transaction Volume</h4>
              <p className="subtitle">Track user engagements by unique Buyer User IDs</p>
              <div className="top-buyers-list">
                {Array.from(new Set(sales.map(s => s.buyer_user_id))).map((userId, idx) => {
                  const userSales = sales.filter(s => s.buyer_user_id === userId);
                  const userSpend = userSales.reduce((sum, s) => sum + (parseFloat(s.total_amount) || 0), 0);
                  const userName = userSales[0]?.buyer_name || 'Buyer';

                  return (
                    <div key={idx} className="buyer-stat-row">
                      <div className="buyer-stat-info">
                        <span className="user-id-tag">{userId}</span>
                        <span className="buyer-stat-name">{userName}</span>
                      </div>
                      <div className="buyer-stat-numbers">
                        <span className="badge badge-sky">{userSales.length} Orders</span>
                        <strong className="text-red">${userSpend.toFixed(2)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analytics-card card-glass">
              <h4>Sales Performance Highlights</h4>
              <div className="highlight-items">
                <div className="highlight-item">
                  <span className="highlight-dot bg-sky"></span>
                  <span><strong>SkyRead Engine:</strong> High velocity real-time sync with Supabase PostgreSQL.</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-dot bg-pink"></span>
                  <span><strong>RBAC Security:</strong> Only admin role can modify products or view administrative metrics.</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-dot bg-yellow"></span>
                  <span><strong>Audit Trail:</strong> Every single checkout records the exact Buyer User ID.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

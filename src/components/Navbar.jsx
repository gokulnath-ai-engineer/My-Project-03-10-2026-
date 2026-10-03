import React from 'react';
import { BookOpen, ShoppingCart, User, ShieldCheck, Database, LogOut, Library, PlusCircle, Sparkles } from 'lucide-react';

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenSupabaseConfig,
  onLogout,
  isSupabaseConfigured
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-logo" onClick={() => setActiveTab('store')}>
          <div className="logo-icon-box">
            <BookOpen className="logo-icon" size={26} />
          </div>
          <div className="logo-text">
            <span className="logo-title">Sky<span className="text-pink">Books</span></span>
            <span className="logo-tagline">Online Book Store & Reader</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-tab-btn ${activeTab === 'store' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            <BookOpen size={17} />
            <span>Store</span>
          </button>

          {currentUser.role === 'admin' ? (
            <button
              className={`nav-tab-btn admin-tab ${activeTab === 'admin' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <ShieldCheck size={17} />
              <span>Admin Dashboard</span>
              <span className="badge badge-pink" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Admin Only</span>
            </button>
          ) : (
            <button
              className={`nav-tab-btn ${activeTab === 'library' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              <Library size={17} />
              <span>My Library & Purchases</span>
            </button>
          )}
        </nav>

        {/* Actions & Profile */}
        <div className="navbar-actions">
          {/* Supabase Status Pill */}
          <button 
            className="supabase-status-pill"
            onClick={onOpenSupabaseConfig}
            title="Configure Supabase Database"
          >
            <Database size={15} className={isSupabaseConfigured ? 'icon-connected' : 'icon-local'} />
            <span className="status-label">
              {isSupabaseConfigured ? 'Supabase: Live' : 'Supabase: Demo Sync'}
            </span>
          </button>

          {/* Cart Icon */}
          <button className="cart-btn" onClick={onOpenCart} aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Profile Pill */}
          <div className="user-profile-menu">
            <div className="user-info-box">
              <span className="user-name">{currentUser.full_name}</span>
              <div className="user-sub-info">
                <span className={`badge ${currentUser.role === 'admin' ? 'badge-pink' : 'badge-sky'}`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'User'}
                </span>
                <span className="user-id-text">ID: {currentUser.user_id}</span>
              </div>
            </div>

            <button 
              className="btn btn-sm btn-outline-pink"
              onClick={onOpenAuth}
              title="Switch Account / Login"
            >
              <User size={15} />
              <span>Switch</span>
            </button>

            <button 
              className="logout-icon-btn"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

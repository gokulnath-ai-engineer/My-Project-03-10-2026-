import React, { useState } from 'react';
import { X, User, ShieldCheck, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEMO_USERS } from '../services/supabaseService';

export default function AuthModal({ isOpen, onClose, onLogin, currentUser }) {
  const [authMode, setAuthMode] = useState('user'); // 'user' | 'admin' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'admin') {
      // Admin verification
      if (!formData.email) {
        setError('Please enter Admin Email');
        return;
      }
      onLogin({
        user_id: 'ADM-001',
        email: formData.email,
        full_name: formData.email.split('@')[0] || 'System Administrator',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss'
      });
      onClose();
    } else if (authMode === 'register') {
      if (!formData.name || !formData.email) {
        setError('Please fill in your name and email');
        return;
      }
      const randomId = `USR-${Math.floor(10000 + Math.random() * 90000)}`;
      onLogin({
        user_id: randomId,
        email: formData.email,
        full_name: formData.name,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`
      });
      onClose();
    } else {
      // User login
      if (!formData.email) {
        setError('Please enter your email');
        return;
      }
      onLogin({
        user_id: 'USR-74892',
        email: formData.email,
        full_name: formData.name || formData.email.split('@')[0] || 'Book Reader',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
      });
      onClose();
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      onLogin(DEMO_USERS.admin);
    } else {
      onLogin(DEMO_USERS.user);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="auth-header-title">
            <Sparkles className="text-yellow" size={22} />
            <h3>SkyBooks Authentication</h3>
          </div>
          <button className="icon-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Quick Demo Switchers */}
          <div className="demo-accounts-card">
            <span className="demo-hint-title">🚀 Fast 1-Click Demo Login</span>
            <div className="demo-buttons-row">
              <button 
                type="button" 
                className="btn btn-sm btn-pink"
                onClick={() => handleQuickDemo('admin')}
              >
                <ShieldCheck size={16} />
                <span>Login as Admin (ADM-001)</span>
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-sky"
                onClick={() => handleQuickDemo('user')}
              >
                <User size={16} />
                <span>Login as Customer (USR-74892)</span>
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tab-buttons">
            <button
              className={`auth-tab-btn ${authMode === 'user' ? 'active-user' : ''}`}
              onClick={() => { setAuthMode('user'); setError(''); }}
            >
              <User size={16} />
              <span>Customer Login</span>
            </button>
            <button
              className={`auth-tab-btn ${authMode === 'admin' ? 'active-admin' : ''}`}
              onClick={() => { setAuthMode('admin'); setError(''); }}
            >
              <ShieldCheck size={16} />
              <span>Admin Login</span>
            </button>
            <button
              className={`auth-tab-btn ${authMode === 'register' ? 'active-reg' : ''}`}
              onClick={() => { setAuthMode('register'); setError(''); }}
            >
              <UserPlus size={16} />
              <span>Sign Up New User</span>
            </button>
          </div>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {authMode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alexander Clark"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {authMode === 'admin' ? 'Admin Official Email' : 'Email Address'}
              </label>
              <input
                type="email"
                className="form-control"
                placeholder={authMode === 'admin' ? 'admin@bookstore.com' : 'user@reader.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <span className="form-help-text">
                {authMode === 'admin' 
                  ? 'Admin access grants permissions to add books, inventory & sales.' 
                  : 'Customer access allows reading previews & purchasing books.'}
              </span>
            </div>

            <div className="auth-submit-row">
              <button
                type="submit"
                className={`btn ${authMode === 'admin' ? 'btn-pink' : authMode === 'register' ? 'btn-yellow' : 'btn-sky'} btn-full`}
              >
                <LogIn size={18} />
                <span>
                  {authMode === 'admin' 
                    ? 'Enter Admin Console' 
                    : authMode === 'register' 
                      ? 'Create Account & Get User ID' 
                      : 'Sign In'}
                </span>
              </button>
            </div>
          </form>

          <div className="current-user-notice">
            <span>Currently logged in as: <strong>{currentUser.full_name}</strong> ({currentUser.role.toUpperCase()})</span>
            <span className="user-id-tag">{currentUser.user_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

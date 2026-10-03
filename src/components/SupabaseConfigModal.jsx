import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Code } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  isConfigured,
  onConfigUpdated
}) {
  const currentConfig = supabaseService.getSavedConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    supabaseService.saveConfig(url.trim(), anonKey.trim());
    setStatusMessage('Settings updated successfully! Testing database link...');
    setTimeout(() => {
      onConfigUpdated();
      setStatusMessage('');
      onClose();
    }, 1200);
  };

  const handleCopySchema = () => {
    const schemaSql = `-- SkyBooks Supabase DB Schema
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  cover_url TEXT,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
  preview_content TEXT,
  full_content TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  pages INTEGER DEFAULT 320,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_user_id VARCHAR(50) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  book_id UUID,
  book_title VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Card',
  status VARCHAR(50) DEFAULT 'Completed',
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

    navigator.clipboard.writeText(schemaSql);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content supabase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-with-icon">
            <Database className={isConfigured ? 'text-sky' : 'text-yellow'} size={24} />
            <div>
              <h3>Supabase DB & API Integration</h3>
              <span className="subtitle">Connect live Supabase Postgres database or use interactive demo sync.</span>
            </div>
          </div>
          <button className="icon-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Status Alert */}
          <div className={`status-banner ${isConfigured ? 'status-banner-live' : 'status-banner-demo'}`}>
            {isConfigured ? (
              <>
                <CheckCircle2 size={20} className="text-sky" />
                <div>
                  <strong>Supabase Live Cloud Connected</strong>
                  <p>Database queries, book inserts, and sales records are directly syncing with your Supabase Postgres tables.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={20} className="text-yellow" />
                <div>
                  <strong>Running in Interactive Demo Mode</strong>
                  <p>Books, Admin Add/Edit, and Sales History with Buyer User IDs are active and stored in your browser session. Connect your Supabase project keys below to sync with the cloud.</p>
                </div>
              </>
            )}
          </div>

          {statusMessage && <div className="auth-error-alert">{statusMessage}</div>}

          {/* Form */}
          <div className="supabase-config-form">
            <div className="form-group">
              <label className="form-label">Supabase Project URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supabase Anon Public API Key</label>
              <input
                type="password"
                className="form-control"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
              />
              <span className="form-help-text">
                Found in your Supabase dashboard: Project Settings &rarr; API &rarr; Project API keys (anon public).
              </span>
            </div>

            <div className="supabase-schema-help card-glass">
              <div className="schema-header">
                <div className="schema-title">
                  <Code size={18} className="text-pink" />
                  <span>Ready-to-Run SQL Schema File</span>
                </div>
                <button className="btn btn-sm btn-outline-pink" onClick={handleCopySchema}>
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
              <p className="schema-desc">
                We generated a complete <code>supabase_schema.sql</code> file in this project root. Paste it into your Supabase SQL Editor to instantly create <code>books</code>, <code>sales</code>, <code>profiles</code>, and RLS policies!
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline-sky" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-sky" onClick={handleSave}>
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

# 📚 SkyBooks - Online Book Store & Reader App

> A full-featured Online Book Store and eBook Reader application built with React, Vite, and Supabase DB API integration. Designed with a clean, high-impact aesthetic strictly utilizing **Sky Blue**, **Pink**, **Red**, and **Yellow**.

---

## 🌟 Key Features

### 👤 Role-Based Authentication & User Experience
- **Customer / User Mode**:
  - Explore curated book catalogues with real-time keyword search and category filters (Sci-Fi, Technology, Fiction, Business, Fantasy).
  - Sort by Featured, Lowest Price, Highest Price, and Customer Ratings.
  - **In-App eBook Reader**: Sample previews for all users, and complete edition reader for purchased titles.
  - Reader features: Theme switching (Sky Daylight, Warm Amber Sepia, Midnight Dark), customizable font scaling, bookmarks, and progress tracking.
  - **Buy Books**: Instant 1-Click Checkout or Shopping Cart Drawer with celebratory confetti.
  - **User Library**: Reading shelf displaying all owned books with full reading access.
  - **User Sales History**: Clear receipts showing the **Buyer User ID** (e.g., `USR-74892`), transaction ID, date, and payment method.

### 🛡️ Admin Management & Control Center
- **Add New Books / Products**:
  - Full metadata creation: Title, Author, Category, Selling Price, Original MSRP, Inventory Stock, Pages, Cover Image URL (with preset selectors), Sample Preview Chapter, and Full Book Content.
- **Inventory & Stock Management**:
  - Live catalog table with inline stock increment/decrement, price editing, and book deletion.
- **Sales & Buyers History Hub**:
  - Comprehensive sales log prominently highlighting the **Buyer User ID** for every transaction, alongside Buyer Name, Email, Book Title, Total Amount, and Status.
- **Sales Analytics Dashboard**:
  - Real-time revenue metrics, total units sold, unique buyers counter, and transaction volume rankings.

### 🎨 Design Palette (Sky Blue, Pink, Red, Yellow ONLY)
- **Sky Blue**: Clean atmospheric gradients, primary headers, category badges, and reader light theme.
- **Pink**: Secondary accents, admin badges, favorite tags, and active tabs.
- **Red**: Discount banners, 'Buy Now' hot actions, price tags, and inventory alerts.
- **Yellow**: Rating stars, highlight ribbons, owned book badges, and warm amber reader theme.

---

## ⚡ Supabase DB & API Integration

The app connects to Supabase PostgreSQL database tables via `@supabase/supabase-js`, with zero-downtime offline fallback:
- **`books`**: Book catalog, inventory, pricing, ratings, sample preview, and full reader content.
- **`sales`**: Completed transactions recording **`buyer_user_id`**, order numbers, buyer details, and amounts.
- **`profiles`**: User accounts and role definitions (`admin` vs `user`).
- **`user_library`**: Books owned by users for full digital reading.

A complete ready-to-run schema is provided in [`supabase_schema.sql`](./supabase_schema.sql).

---

## 🚀 Quick Start & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gokulnath-ai-engineer/My-Project-03-10-2026-.git
   cd My-Project-03-10-2026-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **(Optional) Configure live Supabase:**
   Copy `.env.example` to `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
   Or click the **Supabase** pill in the top navbar to configure directly from the app interface!

---

## 🚀 One-Click Demo Accounts

- **Admin Account**: `admin@bookstore.com` (User ID: `ADM-001`) — Grants access to Add Books, Products & Sales Hub.
- **Customer Account**: `reader@bookstore.com` (User ID: `USR-74892`) — Browse, sample, buy, and read owned books.

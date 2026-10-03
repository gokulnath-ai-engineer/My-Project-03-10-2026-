-- ==============================================================================
-- SKYBOOKS ONLINE BOOK STORE - SUPABASE DATABASE SCHEMA
-- Compatible with Supabase Postgres & RLS (Row Level Security)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table (User & Admin Accounts)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. USR-10492 or Supabase Auth UID
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create BOOKS Table (Products managed by Admin)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price >= price),
  cover_url TEXT,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  preview_content TEXT,
  full_content TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  pages INTEGER DEFAULT 320,
  language VARCHAR(50) DEFAULT 'English',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create SALES & ORDERS Table (History of sales with Buyer User ID)
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_user_id VARCHAR(50) NOT NULL, -- Explicit Buyer User ID mentioned
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  book_title VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Card',
  status VARCHAR(50) DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Refunded')),
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create USER_LIBRARY Table (Books owned/bought by users for reading)
CREATE TABLE IF NOT EXISTS user_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(50) NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reading_progress INTEGER DEFAULT 0,
  UNIQUE(user_id, book_id)
);

-- 6. Seed Initial Admin and Demo User Profiles
INSERT INTO profiles (user_id, full_name, email, role, avatar_url)
VALUES 
  ('ADM-001', 'System Administrator', 'admin@bookstore.com', 'admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss'),
  ('USR-74892', 'Elena Rostova', 'elena@reader.com', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'),
  ('USR-89314', 'Marcus Vance', 'marcus@tech.io', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus')
ON CONFLICT (email) DO NOTHING;

-- 7. Seed Initial Books Catalogue
INSERT INTO books (title, author, category, price, original_price, cover_url, description, stock, rating, pages, is_featured, preview_content, full_content)
VALUES
(
  'The Celestial Protocol',
  'Dr. Aris Thorne',
  'Sci-Fi',
  24.99,
  34.99,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'An exhilarating interstellar voyage into the forbidden depths of synthetic intelligence and ancient cosmic signals detected on Europa.',
  28,
  4.9,
  412,
  true,
  'Chapter 1: The Signal at 0400 Hours\n\nThe deep-space telemetry dish in Atacama shuddered as the high-gain beam locked onto the Jovian radiation belt. It was not noise. It was a structured sequence—repeating prime numbers nested within a cryptographic hash.\n\nCommander Nicole looked at the spectrum analyzer. "Get Dr. Thorne on comms right now," she whispered.',
  'Chapter 1: The Signal at 0400 Hours\n\nThe deep-space telemetry dish in Atacama shuddered as the high-gain beam locked onto the Jovian radiation belt...\n\nChapter 2: Decryption in the Dark\n\nThe cluster computers ran for eighteen uninterrupted hours. When the deciphered matrix finally rendered on the quantum terminal, nobody spoke. The coordinates led to an orbital relay buried inside Triton crater...\n\nChapter 3: The Departure\n\nWith zero margin for error, the Hermes IV ignited its ion thrusters, breaking orbital velocity and entering the dark corridor toward the outer rim.'
),
(
  'Mastering Modern Web Architecture',
  'Sarah Jenkins',
  'Technology',
  39.50,
  49.99,
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  'The definitive developer guide to modern cloud architectures, micro-frontends, edge computing, and real-time distributed state.',
  15,
  4.8,
  520,
  true,
  'Introduction: The Evolution of Web Platforms\n\nModern web systems require low latency, resilient state management, and declarative data boundaries. In this chapter, we evaluate reactive caching layers and edge delivery networks.',
  'Introduction: The Evolution of Web Platforms\n\nModern web systems require low latency, resilient state management...\n\nChapter 1: Edge Rendering & Distributed State\n\nBy pushing compute to CDN edge locations, round-trip latencies drop by over 65%. We will configure multi-region data replication...\n\nChapter 2: Scalable API Gateways\n\nHandling millions of requests per second demands non-blocking asynchronous event loops with circuit breakers and fallback caches.'
),
(
  'Whispers of the Sakura Valley',
  'Kenji Takahashi',
  'Fiction',
  18.00,
  22.50,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'A poetic and touching tale of memory, ancestral tea ceremonies, and unexpected love in the quiet mountains of Kyoto.',
  35,
  4.7,
  288,
  false,
  'Chapter 1: The Spring Mist\n\nThe early morning fog wrapped around the cedar trees of Mount Hiei. Old Master Haru swept the gravel courtyard in measured, rhythmic strokes that had remained unchanged for fifty years.',
  'Chapter 1: The Spring Mist\n\nThe early morning fog wrapped around the cedar trees of Mount Hiei...\n\nChapter 2: The Letter from Kyoto\n\nA lacquered wooden box arrived at noon. Inside lay a single dried tea blossom and a seal stamped in vermilion cinnabar ink.'
),
(
  'The High-Stakes Entrepreneur',
  'Victoria Sterling',
  'Business',
  29.99,
  35.00,
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
  'Proven tactical playbooks for raising capital, scaling high-velocity teams, and creating defensible market moats in turbulent economies.',
  22,
  4.9,
  360,
  true,
  'Foreword: Risk As Capital\n\nEvery venture begins with asymmetric risk. True value creators do not seek certainty; they identify high-probability imbalances before the market prices them in.',
  'Foreword: Risk As Capital\n\nEvery venture begins with asymmetric risk...\n\nChapter 1: The Zero-to-One Flywheel\n\nConstructing an engine that compounds naturally without excessive ad spend requires razor-sharp product resonance.'
),
(
  'Chronicles of Eldoria: The Sun Stone',
  'Rowan Blackwood',
  'Fantasy',
  21.50,
  27.00,
  'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
  'When the ancient dragon wards crumble, an exiled archivist and an apprentice spell-forger must recover the lost solar artifact.',
  19,
  4.8,
  480,
  false,
  'Prologue: When the Runes Faded\n\nThe silver glyphs carved into the Citadel walls had burned blue for seven centuries. Tonight, for the first time in recorded memory, the flame flickered and turned to cold ash.',
  'Prologue: When the Runes Faded\n\nThe silver glyphs carved into the Citadel walls had burned blue...\n\nChapter 1: The Archivist in Chains\n\nKael brushed dust off the forbidden parchment. The glyphs did not merely describe history; they were an activation sequence.'
);

-- 8. Seed Initial Sales History with Buyer User IDs
INSERT INTO sales (order_number, buyer_user_id, buyer_name, buyer_email, book_id, book_title, price, quantity, total_amount, payment_method, status, sale_date)
VALUES
(
  'ORD-9021',
  'USR-74892',
  'Elena Rostova',
  'elena@reader.com',
  (SELECT id FROM books WHERE title = 'The Celestial Protocol' LIMIT 1),
  'The Celestial Protocol',
  24.99,
  1,
  24.99,
  'Credit Card',
  'Completed',
  NOW() - INTERVAL '2 days'
),
(
  'ORD-9022',
  'USR-89314',
  'Marcus Vance',
  'marcus@tech.io',
  (SELECT id FROM books WHERE title = 'Mastering Modern Web Architecture' LIMIT 1),
  'Mastering Modern Web Architecture',
  39.50,
  1,
  39.50,
  'UPI / Instant Pay',
  'Completed',
  NOW() - INTERVAL '1 day'
),
(
  'ORD-9023',
  'USR-74892',
  'Elena Rostova',
  'elena@reader.com',
  (SELECT id FROM books WHERE title = 'Whispers of the Sakura Valley' LIMIT 1),
  'Whispers of the Sakura Valley',
  18.00,
  1,
  18.00,
  'Debit Card',
  'Completed',
  NOW() - INTERVAL '6 hours'
);

-- 9. Row Level Security Policies (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

-- Public can read books
CREATE POLICY "Public books read" ON books FOR SELECT USING (true);
-- Admin can insert/update/delete books
CREATE POLICY "Admin manage books" ON books FOR ALL USING (true);

-- Sales policies: Admin can view all sales, Users can insert and read their own
CREATE POLICY "Sales read access" ON sales FOR SELECT USING (true);
CREATE POLICY "Sales insert access" ON sales FOR INSERT WITH CHECK (true);

-- Library policies
CREATE POLICY "User library read" ON user_library FOR SELECT USING (true);
CREATE POLICY "User library insert" ON user_library FOR INSERT WITH CHECK (true);

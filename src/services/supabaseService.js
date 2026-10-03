import { createClient } from '@supabase/supabase-js';

// Default initial demo books
export const INITIAL_BOOKS = [
  {
    id: 'b1-celestial-protocol',
    title: 'The Celestial Protocol',
    author: 'Dr. Aris Thorne',
    category: 'Sci-Fi',
    price: 24.99,
    original_price: 34.99,
    cover_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'An exhilarating interstellar voyage into the forbidden depths of synthetic intelligence and ancient cosmic signals detected on Europa.',
    stock: 28,
    rating: 4.9,
    pages: 412,
    language: 'English',
    is_featured: true,
    preview_content: `Chapter 1: The Signal at 0400 Hours\n\nThe deep-space telemetry dish in Atacama shuddered as the high-gain beam locked onto the Jovian radiation belt. It was not noise. It was a structured sequence—repeating prime numbers nested within a cryptographic hash.\n\nCommander Nicole looked at the spectrum analyzer. "Get Dr. Thorne on comms right now," she whispered.\n\nWithin minutes, the orbital link crackled to life. Thorne was already watching the stream from the orbital station. "It's not an echo, Nicole. It's an invitation."`,
    full_content: `Chapter 1: The Signal at 0400 Hours\n\nThe deep-space telemetry dish in Atacama shuddered as the high-gain beam locked onto the Jovian radiation belt. It was not noise. It was a structured sequence—repeating prime numbers nested within a cryptographic hash.\n\nCommander Nicole looked at the spectrum analyzer. "Get Dr. Thorne on comms right now," she whispered.\n\nChapter 2: Decryption in the Dark\n\nThe cluster computers ran for eighteen uninterrupted hours. When the deciphered matrix finally rendered on the quantum terminal, nobody spoke. The coordinates led to an orbital relay buried inside Triton crater.\n\nChapter 3: The Departure\n\nWith zero margin for error, the Hermes IV ignited its ion thrusters, breaking orbital velocity and entering the dark corridor toward the outer rim.`
  },
  {
    id: 'b2-modern-web-arch',
    title: 'Mastering Modern Web Architecture',
    author: 'Sarah Jenkins',
    category: 'Technology',
    price: 39.50,
    original_price: 49.99,
    cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description: 'The definitive developer guide to modern cloud architectures, micro-frontends, edge computing, and real-time distributed state.',
    stock: 15,
    rating: 4.8,
    pages: 520,
    language: 'English',
    is_featured: true,
    preview_content: `Introduction: The Evolution of Web Platforms\n\nModern web systems require low latency, resilient state management, and declarative data boundaries. In this chapter, we evaluate reactive caching layers and edge delivery networks.\n\nWhen scaling to millions of concurrent users, traditional monolithic paradigms collapse under the weight of database locks and synchronous IPC bottlenecks.`,
    full_content: `Introduction: The Evolution of Web Platforms\n\nModern web systems require low latency, resilient state management...\n\nChapter 1: Edge Rendering & Distributed State\n\nBy pushing compute to CDN edge locations, round-trip latencies drop by over 65%. We configure multi-region data replication with CRDTs to resolve conflict-free concurrent edits.\n\nChapter 2: Scalable API Gateways & Service Mesh\n\nHandling millions of requests per second demands non-blocking asynchronous event loops with circuit breakers and fallback caches.`
  },
  {
    id: 'b3-sakura-valley',
    title: 'Whispers of the Sakura Valley',
    author: 'Kenji Takahashi',
    category: 'Fiction',
    price: 18.00,
    original_price: 22.50,
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'A poetic and touching tale of memory, ancestral tea ceremonies, and unexpected love in the quiet mountains of Kyoto.',
    stock: 35,
    rating: 4.7,
    pages: 288,
    language: 'English',
    is_featured: false,
    preview_content: `Chapter 1: The Spring Mist\n\nThe early morning fog wrapped around the cedar trees of Mount Hiei. Old Master Haru swept the gravel courtyard in measured, rhythmic strokes that had remained unchanged for fifty years.\n\nA gentle breeze carried the fragile fragrance of blossoming cherry trees from the lower terrace.`,
    full_content: `Chapter 1: The Spring Mist\n\nThe early morning fog wrapped around the cedar trees of Mount Hiei...\n\nChapter 2: The Letter from Kyoto\n\nA lacquered wooden box arrived at noon. Inside lay a single dried tea blossom and a seal stamped in vermilion cinnabar ink. The signature belonged to a family thought lost after the great fire.`
  },
  {
    id: 'b4-high-stakes-entrepreneur',
    title: 'The High-Stakes Entrepreneur',
    author: 'Victoria Sterling',
    category: 'Business',
    price: 29.99,
    original_price: 35.00,
    cover_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
    description: 'Proven tactical playbooks for raising capital, scaling high-velocity teams, and creating defensible market moats in turbulent economies.',
    stock: 22,
    rating: 4.9,
    pages: 360,
    language: 'English',
    is_featured: true,
    preview_content: `Foreword: Risk As Capital\n\nEvery venture begins with asymmetric risk. True value creators do not seek certainty; they identify high-probability imbalances before the market prices them in.\n\nIf you wait for full consensus, the opportunity has already vanished.`,
    full_content: `Foreword: Risk As Capital\n\nEvery venture begins with asymmetric risk...\n\nChapter 1: The Zero-to-One Flywheel\n\nConstructing an engine that compounds naturally without excessive ad spend requires razor-sharp product resonance.\n\nChapter 2: Building Defensible Moats\n\nNetwork effects and proprietary switching costs safeguard enterprise margins against aggressive commoditization.`
  },
  {
    id: 'b5-chronicles-eldoria',
    title: 'Chronicles of Eldoria: The Sun Stone',
    author: 'Rowan Blackwood',
    category: 'Fantasy',
    price: 21.50,
    original_price: 27.00,
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
    description: 'When the ancient dragon wards crumble, an exiled archivist and an apprentice spell-forger must recover the lost solar artifact.',
    stock: 19,
    rating: 4.8,
    pages: 480,
    language: 'English',
    is_featured: false,
    preview_content: `Prologue: When the Runes Faded\n\nThe silver glyphs carved into the Citadel walls had burned blue for seven centuries. Tonight, for the first time in recorded memory, the flame flickered and turned to cold ash.\n\nThe high librarian backed away from the altar in terror.`,
    full_content: `Prologue: When the Runes Faded\n\nThe silver glyphs carved into the Citadel walls had burned blue...\n\nChapter 1: The Archivist in Chains\n\nKael brushed dust off the forbidden parchment. The glyphs did not merely describe history; they were an activation sequence that resonated with the pulse in his veins.`
  }
];

// Initial demo sales transactions with Buyer User IDs
export const INITIAL_SALES = [
  {
    id: 'sl-001',
    order_number: 'ORD-9021',
    buyer_user_id: 'USR-74892',
    buyer_name: 'Elena Rostova',
    buyer_email: 'elena@reader.com',
    book_id: 'b1-celestial-protocol',
    book_title: 'The Celestial Protocol',
    price: 24.99,
    quantity: 1,
    total_amount: 24.99,
    payment_method: 'Credit Card',
    status: 'Completed',
    sale_date: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'sl-002',
    order_number: 'ORD-9022',
    buyer_user_id: 'USR-89314',
    buyer_name: 'Marcus Vance',
    buyer_email: 'marcus@tech.io',
    book_id: 'b2-modern-web-arch',
    book_title: 'Mastering Modern Web Architecture',
    price: 39.50,
    quantity: 1,
    total_amount: 39.50,
    payment_method: 'UPI / Instant Pay',
    status: 'Completed',
    sale_date: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'sl-003',
    order_number: 'ORD-9023',
    buyer_user_id: 'USR-74892',
    buyer_name: 'Elena Rostova',
    buyer_email: 'elena@reader.com',
    book_id: 'b3-sakura-valley',
    book_title: 'Whispers of the Sakura Valley',
    price: 18.00,
    quantity: 1,
    total_amount: 18.00,
    payment_method: 'Debit Card',
    status: 'Completed',
    sale_date: new Date(Date.now() - 4 * 3600000).toISOString()
  }
];

// Initial preloaded users
export const DEMO_USERS = {
  admin: {
    user_id: 'ADM-001',
    email: 'admin@bookstore.com',
    full_name: 'Store Administrator',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss'
  },
  user: {
    user_id: 'USR-74892',
    email: 'reader@bookstore.com',
    full_name: 'Elena Rostova',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  }
};

// Storage Keys
const STORAGE_KEYS = {
  BOOKS: 'skybooks_books',
  SALES: 'skybooks_sales',
  LIBRARY: 'skybooks_library',
  AUTH_USER: 'skybooks_auth_user',
  SUPABASE_CONFIG: 'skybooks_supabase_config'
};

// Supabase Client Manager
class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.initClient();
    this.initLocalStorage();
  }

  getSavedConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    };
  }

  saveConfig(url, anonKey) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url, anonKey }));
    this.initClient();
  }

  initClient() {
    const config = this.getSavedConfig();
    if (config.url && config.anonKey && config.url.startsWith('https://')) {
      try {
        this.client = createClient(config.url, config.anonKey);
        this.isConfigured = true;
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  initLocalStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIBRARY)) {
      // Pre-seed user library for demo user
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify([
        {
          user_id: 'USR-74892',
          book_id: 'b1-celestial-protocol',
          purchased_at: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          user_id: 'USR-74892',
          book_id: 'b3-sakura-valley',
          purchased_at: new Date(Date.now() - 4 * 3600000).toISOString()
        }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTH_USER)) {
      // Default to demo user
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_USERS.user));
    }
  }

  // --- Auth Methods ---
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEMO_USERS.user;
  }

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }

  // --- Books CRUD (Admin & Public) ---
  async getBooks() {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch books error, using local fallback:', err);
      }
    }
    // Local fallback
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return stored ? JSON.parse(stored) : INITIAL_BOOKS;
  }

  async addBook(newBook) {
    const bookWithDefaults = {
      ...newBook,
      id: newBook.id || `b-${Date.now()}`,
      rating: newBook.rating || 5.0,
      stock: parseInt(newBook.stock, 10) || 10,
      price: parseFloat(newBook.price) || 19.99,
      original_price: parseFloat(newBook.original_price) || parseFloat(newBook.price) || 24.99,
      pages: parseInt(newBook.pages, 10) || 300,
      created_at: new Date().toISOString()
    };

    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client.from('books').insert([bookWithDefaults]).select();
        if (!error && data) {
          // also update local cache
          this._addBookLocally(bookWithDefaults);
          return { success: true, book: data[0] };
        }
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err);
      }
    }

    this._addBookLocally(bookWithDefaults);
    return { success: true, book: bookWithDefaults };
  }

  _addBookLocally(book) {
    const books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
    books.unshift(book);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }

  async updateBook(id, updatedFields) {
    if (this.isConfigured && this.client) {
      try {
        await this.client.from('books').update(updatedFields).eq('id', id);
      } catch (err) {
        console.warn('Supabase update book error:', err);
      }
    }
    const books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    }
    return { success: true };
  }

  async deleteBook(id) {
    if (this.isConfigured && this.client) {
      try {
        await this.client.from('books').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete book error:', err);
      }
    }
    let books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
    books = books.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    return { success: true };
  }

  // --- Sales & History (Mentions Buyer User ID) ---
  async getSales() {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('sales')
          .select('*')
          .order('sale_date', { ascending: false });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch sales error:', err);
      }
    }
    const stored = localStorage.getItem(STORAGE_KEYS.SALES);
    return stored ? JSON.parse(stored) : INITIAL_SALES;
  }

  async recordSale({ user, book, paymentMethod = 'Credit Card', quantity = 1 }) {
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const saleRecord = {
      id: `sl-${Date.now()}`,
      order_number: orderNumber,
      buyer_user_id: user.user_id, // Specific requirement: Buyer User ID
      buyer_name: user.full_name,
      buyer_email: user.email,
      book_id: book.id,
      book_title: book.title,
      price: book.price,
      quantity,
      total_amount: Number((book.price * quantity).toFixed(2)),
      payment_method: paymentMethod,
      status: 'Completed',
      sale_date: new Date().toISOString()
    };

    if (this.isConfigured && this.client) {
      try {
        await this.client.from('sales').insert([saleRecord]);
      } catch (err) {
        console.warn('Supabase sale insert error:', err);
      }
    }

    // Save locally
    const sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || '[]');
    sales.unshift(saleRecord);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

    // Decrement stock in books
    await this.updateBook(book.id, {
      stock: Math.max(0, (book.stock || 1) - quantity)
    });

    // Add to User Library
    this.addBookToUserLibrary(user.user_id, book.id);

    return saleRecord;
  }

  // --- User Library (Purchased Books) ---
  getUserLibrary(userId) {
    const library = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY) || '[]');
    return library.filter(item => item.user_id === userId);
  }

  addBookToUserLibrary(userId, bookId) {
    const library = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY) || '[]');
    const exists = library.some(item => item.user_id === userId && item.book_id === bookId);
    if (!exists) {
      library.push({
        user_id: userId,
        book_id: bookId,
        purchased_at: new Date().toISOString(),
        reading_progress: 0
      });
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
    }
  }

  isBookPurchased(userId, bookId) {
    const userLibrary = this.getUserLibrary(userId);
    return userLibrary.some(item => item.book_id === bookId);
  }
}

export const supabaseService = new SupabaseService();

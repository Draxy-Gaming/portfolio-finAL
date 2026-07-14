import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'movies.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    original_title TEXT,
    slug TEXT UNIQUE NOT NULL,
    overview TEXT,
    release_date TEXT,
    release_year INTEGER,
    runtime INTEGER,
    poster_url TEXT,
    backdrop_url TEXT,
    language TEXT,
    tmdb_id INTEGER UNIQUE,
    imdb_id TEXT,
    external_rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_movie_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL UNIQUE,
    status TEXT CHECK(status IN ('watched', 'want_to_watch', 'favorite', 'currently_watching', 'dropped')) NOT NULL DEFAULT 'want_to_watch',
    personal_rating REAL CHECK(personal_rating >= 0 AND personal_rating <= 10),
    watch_date TEXT,
    rewatch_count INTEGER DEFAULT 0,
    short_note TEXT,
    full_review TEXT,
    is_public BOOLEAN DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    display_order INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_public BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS movie_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_movie_entry_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (user_movie_entry_id) REFERENCES user_movie_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(user_movie_entry_id, category_id)
  );

  -- Create triggers to update updated_at
  CREATE TRIGGER IF NOT EXISTS update_movies_updated_at
  AFTER UPDATE ON movies
  FOR EACH ROW
  BEGIN
    UPDATE movies SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_user_movie_entries_updated_at
  AFTER UPDATE ON user_movie_entries
  FOR EACH ROW
  BEGIN
    UPDATE user_movie_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_categories_updated_at
  AFTER UPDATE ON categories
  FOR EACH ROW
  BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;
`);

export default db;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import db from './db.js';

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TMDB Search API
app.get('/api/movies/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      // Mock data if no API key is provided
      console.warn('TMDB_API_KEY is not set. Returning mock data.');
      return res.json({
        results: [
          {
            id: 12345,
            title: `Mock Movie for "${query}"`,
            original_title: `Mock Movie Original`,
            release_date: '2023-01-01',
            overview: 'This is a mock overview because no TMDB API key was provided.',
            poster_path: null,
            backdrop_path: null,
            vote_average: 7.5
          }
        ]
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching TMDB:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Helper to generate slug
const generateSlug = (title, year) => {
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (year) {
    slug += `-${year}`;
  }
  return slug;
};

// Mock auth middleware - required auth
const authenticateAdmin = (req, res, next) => {
  const providedSecret = req.headers['x-admin-secret'];
  const adminSecret = process.env.ADMIN_SECRET || 'dev-secret'; // Provide default for development testing
  if (providedSecret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Import Movie API
app.post('/api/movies/import', authenticateAdmin, (req, res) => {
  try {
    const movieData = req.body;

    // Check if movie already exists
    const existingMovie = db.prepare('SELECT id FROM movies WHERE tmdb_id = ?').get(movieData.tmdb_id);

    if (existingMovie) {
      // Return existing entry
      const existingEntry = db.prepare('SELECT * FROM user_movie_entries WHERE movie_id = ?').get(existingMovie.id);
      return res.json({ movie: existingMovie, entry: existingEntry, isNew: false });
    }

    const releaseYear = movieData.release_date ? parseInt(movieData.release_date.substring(0, 4)) : null;
    let slug = generateSlug(movieData.title, releaseYear);

    // Ensure slug uniqueness
    let slugExists = db.prepare('SELECT id FROM movies WHERE slug = ?').get(slug);
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(movieData.title, releaseYear)}-${counter}`;
      slugExists = db.prepare('SELECT id FROM movies WHERE slug = ?').get(slug);
      counter++;
    }

    // Insert Movie
    const insertMovie = db.prepare(`
      INSERT INTO movies (title, original_title, slug, overview, release_date, release_year, poster_url, backdrop_url, tmdb_id, external_rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertMovie.run(
      movieData.title,
      movieData.original_title,
      slug,
      movieData.overview,
      movieData.release_date,
      releaseYear,
      movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
      movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
      movieData.tmdb_id,
      movieData.vote_average
    );

    const movieId = result.lastInsertRowid;

    // Create default personal entry
    const insertEntry = db.prepare(`
      INSERT INTO user_movie_entries (movie_id, status, is_public)
      VALUES (?, 'want_to_watch', 0)
    `);

    insertEntry.run(movieId);

    const newMovie = db.prepare('SELECT * FROM movies WHERE id = ?').get(movieId);
    const newEntry = db.prepare('SELECT * FROM user_movie_entries WHERE movie_id = ?').get(movieId);

    res.status(201).json({ movie: newMovie, entry: newEntry, isNew: true });
  } catch (error) {
    console.error('Error importing movie:', error);
    res.status(500).json({ error: 'Failed to import movie' });
  }
});

// Get All Movies (with optional public filter)
app.get('/api/movies', (req, res) => {
  try {
    const { publicOnly } = req.query;

    let query = `
      SELECT
        m.*,
        e.id as entry_id, e.status, e.personal_rating, e.watch_date,
        e.rewatch_count, e.short_note, e.full_review, e.is_public, e.is_featured, e.display_order
      FROM movies m
      JOIN user_movie_entries e ON m.id = e.movie_id
    `;

    if (publicOnly === 'true') {
      query += ` WHERE e.is_public = 1`;
    }

    query += ` ORDER BY m.created_at DESC`;

    const movies = db.prepare(query).all();

    // Fetch categories for each movie
    const moviesWithCategories = movies.map(movie => {
      const categories = db.prepare(`
        SELECT c.*
        FROM categories c
        JOIN movie_categories mc ON c.id = mc.category_id
        WHERE mc.user_movie_entry_id = ?
      `).all(movie.entry_id);
      return { ...movie, categories };
    });

    res.json(moviesWithCategories);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get Single Movie by slug or ID
app.get('/api/movies/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;

    const isId = !isNaN(identifier);

    let query = `
      SELECT
        m.*,
        e.id as entry_id, e.status, e.personal_rating, e.watch_date,
        e.rewatch_count, e.short_note, e.full_review, e.is_public, e.is_featured, e.display_order
      FROM movies m
      JOIN user_movie_entries e ON m.id = e.movie_id
      WHERE ${isId ? 'm.id = ?' : 'm.slug = ?'}
    `;

    const movie = db.prepare(query).get(identifier);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const categories = db.prepare(`
      SELECT c.*
      FROM categories c
      JOIN movie_categories mc ON c.id = mc.category_id
      WHERE mc.user_movie_entry_id = ?
    `).all(movie.entry_id);

    res.json({ ...movie, categories });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Update Movie Entry
app.put('/api/movies/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, personal_rating, short_note, full_review, is_public, is_featured, category_ids } = req.body;

    const entry = db.prepare('SELECT id FROM user_movie_entries WHERE movie_id = ?').get(id);
    if (!entry) {
      return res.status(404).json({ error: 'Movie entry not found' });
    }

    db.prepare(`
      UPDATE user_movie_entries
      SET status = ?, personal_rating = ?, short_note = ?, full_review = ?, is_public = ?, is_featured = ?
      WHERE movie_id = ?
    `).run(
      status,
      personal_rating,
      short_note,
      full_review,
      is_public ? 1 : 0,
      is_featured ? 1 : 0,
      id
    );

    // Update categories
    if (Array.isArray(category_ids)) {
      db.prepare('DELETE FROM movie_categories WHERE user_movie_entry_id = ?').run(entry.id);

      const insertCategory = db.prepare('INSERT INTO movie_categories (user_movie_entry_id, category_id) VALUES (?, ?)');
      for (const categoryId of category_ids) {
        insertCategory.run(entry.id, categoryId);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete Movie
app.delete('/api/movies/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;

    // Cascades will handle entry and categories
    const result = db.prepare('DELETE FROM movies WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Get All Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create Category
app.post('/api/categories', authenticateAdmin, (req, res) => {
  try {
    const { name, description, is_public } = req.body;

    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const insert = db.prepare(`
      INSERT INTO categories (name, slug, description, is_public)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(name, slug, description, is_public !== undefined ? (is_public ? 1 : 0) : 1);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

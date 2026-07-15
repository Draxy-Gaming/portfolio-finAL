import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies?publicOnly=true');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    if (filter === 'all') return true;
    if (filter === 'watched') return movie.status === 'watched';
    if (filter === 'want_to_watch') return movie.status === 'want_to_watch';
    if (filter === 'favorite') return movie.status === 'favorite';
    return true;
  });

  return (
    <section className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Movies</h1>
          <p className="text-lg text-neutral-400 max-w-2xl">
            A curated collection of films I've watched, loved, rated, and plan to watch.
            This section is part personal archive, part exploration of taste.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['all', 'watched', 'want_to_watch', 'favorite'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-white text-black border-white'
                  : 'border-white-600 text-neutral-400 hover:text-white hover:border-white'
              }`}
            >
              {f.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-neutral-400 py-12">Loading movies...</div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center text-neutral-400 py-12">No movies found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, Plus } from 'lucide-react';
import { getAdminSecret, clearAdminSecret } from '../../utils/auth';
import AdminLogin from './AdminLogin';

export default function AddMovie() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAdminSecret());
  const navigate = useNavigate();

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const importMovie = async (movie) => {
    try {
      const response = await fetch('/api/movies/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': getAdminSecret() },
        body: JSON.stringify(movie)
      });
      if (response.status === 401) {
        clearAdminSecret();
        setIsAuthenticated(false);
        return;
      }
      const data = await response.json();
      // Redirect to edit page
      navigate(`/admin/movies/${data.movie.id}/edit`);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <section className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin/movies" className="inline-flex items-center text-neutral-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Admin
        </Link>

        <h1 className="text-3xl font-bold mb-8">Add Movie from TMDB</h1>

        <form onSubmit={searchMovies} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search movie title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-indigo border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-white-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-2 rounded font-medium flex items-center disabled:opacity-50"
          >
            <Search className="w-5 h-5 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(movie => (
            <div key={movie.id} className="bg-indigo border border-white/10 rounded-xl p-4 flex gap-4">
              <div className="w-20 shrink-0">
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-full rounded" />
                ) : (
                  <div className="w-full aspect-[2/3] bg-storm rounded flex items-center justify-center text-xs text-neutral-400 text-center">No Poster</div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{movie.title}</h3>
                  <p className="text-neutral-400 text-sm mb-2">{movie.release_date?.substring(0, 4)}</p>
                  <p className="text-neutral-400 text-xs line-clamp-2">{movie.overview}</p>
                </div>
                <button
                  onClick={() => importMovie(movie)}
                  className="mt-3 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium self-start flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Import
                </button>
              </div>
            </div>
          ))}
        </div>
        {results.length === 0 && query && !loading && (
          <p className="text-neutral-400">No results found.</p>
        )}
      </div>
    </section>
  );
}

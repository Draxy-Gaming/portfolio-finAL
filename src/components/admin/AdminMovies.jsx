import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';
import { getAdminSecret, clearAdminSecret } from '../../utils/auth';
import AdminLogin from './AdminLogin';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAdminSecret());
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    clearAdminSecret();
    setIsAuthenticated(false);
  };

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');

  const toggleVisibility = async (movie) => {
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': getAdminSecret() },
        body: JSON.stringify({ ...movie, is_public: !movie.is_public })
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      fetchMovies(); // refresh
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    }
  };

  const filteredMovies = movies.filter(movie => {
    if (filterStatus !== 'all' && movie.status !== filterStatus) return false;
    if (filterVisibility !== 'all') {
      const isPublic = filterVisibility === 'public';
      if (movie.is_public !== isPublic) return false;
    }
    return true;
  });

  const deleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie from your collection?')) return;
    try {
      const response = await fetch(`/api/movies/${id}`, { method: 'DELETE', headers: { 'x-admin-secret': getAdminSecret() } });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      fetchMovies();
    } catch (error) {
      console.error('Failed to delete movie', error);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <section className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin: My Movies</h1>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="text-neutral-400 hover:text-white mr-4">Logout</button>
            <Link to="/admin/categories" className="bg-storm text-white px-4 py-2 rounded font-medium border border-white/10 hover:bg-indigo">
              Manage Categories
            </Link>
            <Link to="/admin/movies/add" className="bg-white text-black px-4 py-2 rounded font-medium flex items-center">
              <Plus className="w-5 h-5 mr-2" /> Add Movie
            </Link>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-primary border border-white/10 rounded px-4 py-2 text-white text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="want_to_watch">Want to Watch</option>
            <option value="watched">Watched</option>
            <option value="favorite">Favorite</option>
            <option value="currently_watching">Currently Watching</option>
            <option value="dropped">Dropped</option>
          </select>

          <select
            value={filterVisibility}
            onChange={e => setFilterVisibility(e.target.value)}
            className="bg-primary border border-white/10 rounded px-4 py-2 text-white text-sm"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-indigo border border-white/10 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-storm text-neutral-400">
                <tr>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Visibility</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white-800 text-white">
                {filteredMovies.map(movie => (
                  <tr key={movie.id} className="hover:bg-storm transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        {movie.poster_url && (
                          <img src={movie.poster_url} alt="" className="w-10 h-14 object-cover mr-4 rounded bg-primary" />
                        )}
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-neutral-400 text-xs">{movie.release_year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-neutral-400 border border-white/10 px-2 py-1 rounded text-xs">
                        {movie.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-yellow-500">
                      {movie.personal_rating ? `★ ${movie.personal_rating}` : '-'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleVisibility(movie)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          movie.is_public ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {movie.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {movie.is_public ? 'Public' : 'Private'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/movies/${movie.id}/edit`} className="text-blue-400 hover:text-blue-300">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button onClick={() => deleteMovie(movie.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-neutral-400">No movies found. Start adding some!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

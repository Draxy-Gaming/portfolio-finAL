import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getAdminSecret, clearAdminSecret } from '../../utils/auth';
import AdminLogin from './AdminLogin';

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAdminSecret());

  const [movie, setMovie] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    status: 'want_to_watch',
    personal_rating: '',
    short_note: '',
    full_review: '',
    is_public: false,
    is_featured: false,
    category_ids: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, catRes] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch('/api/categories')
        ]);

        const movieData = await movieRes.json();
        const catData = await catRes.json();

        setMovie(movieData);
        setCategories(catData);

        setFormData({
          status: movieData.status || 'want_to_watch',
          personal_rating: movieData.personal_rating || '',
          short_note: movieData.short_note || '',
          full_review: movieData.full_review || '',
          is_public: !!movieData.is_public,
          is_featured: !!movieData.is_featured,
          category_ids: movieData.categories?.map(c => c.id) || []
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': getAdminSecret() },
        body: JSON.stringify({
          ...formData,
          personal_rating: formData.personal_rating ? parseFloat(formData.personal_rating) : null
        })
      });
      if (response.status === 401) {
        clearAdminSecret();
        setIsAuthenticated(false);
        return;
      }
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error saving movie:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (catId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter(id => id !== catId)
        : [...prev.category_ids, catId]
    }));
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!movie) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <section className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin/movies" className="inline-flex items-center text-neutral-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Admin
        </Link>

        <div className="flex gap-6 mb-8 items-center bg-indigo p-6 rounded-xl border border-white/10">
          {movie.poster_url && (
            <img src={movie.poster_url} alt="" className="w-24 rounded shadow" />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit: {movie.title}</h1>
            <p className="text-neutral-400">{movie.release_year}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full bg-indigo border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-white-600"
              >
                <option value="want_to_watch">Want to Watch</option>
                <option value="watched">Watched</option>
                <option value="favorite">Favorite</option>
                <option value="currently_watching">Currently Watching</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-400">Personal Rating (0-10)</label>
              <input
                type="number"
                min="0" max="10" step="0.5"
                value={formData.personal_rating}
                onChange={e => setFormData({...formData, personal_rating: e.target.value})}
                className="w-full bg-indigo border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-white-600"
                placeholder="e.g. 8.5"
              />
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="flex gap-8 p-4 bg-indigo border border-white/10 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={e => setFormData({...formData, is_public: e.target.checked})}
                className="w-4 h-4 rounded border-white/10"
              />
              <span className="text-sm font-medium">Make Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                className="w-4 h-4 rounded border-white/10"
              />
              <span className="text-sm font-medium">Featured (Highlight)</span>
            </label>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-400">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.category_ids.includes(cat.id)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-indigo border-white/10 text-neutral-400 hover:border-white-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {categories.length === 0 && <span className="text-sm text-neutral-400">No categories found. Create some via API or DB first.</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-400">Short Note (Quote / TLDR)</label>
            <input
              type="text"
              value={formData.short_note}
              onChange={e => setFormData({...formData, short_note: e.target.value})}
              className="w-full bg-indigo border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-white-600"
              placeholder="A brief thought on the movie..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-400">Full Review</label>
            <textarea
              rows="6"
              value={formData.full_review}
              onChange={e => setFormData({...formData, full_review: e.target.value})}
              className="w-full bg-indigo border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-white-600"
              placeholder="Write a longer review here..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-white text-black px-8 py-3 rounded font-medium flex items-center justify-center w-full disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </section>
  );
}

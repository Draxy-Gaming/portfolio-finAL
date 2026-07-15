import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Tag } from 'lucide-react';
import { getAdminSecret, clearAdminSecret } from '../../utils/auth';
import AdminLogin from './AdminLogin';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAdminSecret());

  const [newCategory, setNewCategory] = useState({ name: '', description: '', is_public: true });
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    setAdding(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': getAdminSecret() },
        body: JSON.stringify(newCategory)
      });
      if (response.status === 401) {
        clearAdminSecret();
        setIsAuthenticated(false);
        return;
      }
      setNewCategory({ name: '', description: '', is_public: true });
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category', error);
    } finally {
      setAdding(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <section className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center"><Tag className="mr-2" /> Categories</h1>
          <Link to="/admin/movies" className="text-neutral-400 hover:text-white">
            Back to Movies
          </Link>
        </div>

        {/* Create Form */}
        <div className="bg-indigo p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Category Name (e.g., Best Sci-Fi)"
              value={newCategory.name}
              onChange={e => setNewCategory({...newCategory, name: e.target.value})}
              className="flex-1 bg-primary border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neutral-400"
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={newCategory.description}
              onChange={e => setNewCategory({...newCategory, description: e.target.value})}
              className="flex-1 bg-primary border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neutral-400"
            />
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={newCategory.is_public}
                onChange={e => setNewCategory({...newCategory, is_public: e.target.checked})}
                className="w-4 h-4 rounded border-white/10"
              />
              <span className="text-sm font-medium">Public</span>
            </label>
            <button
              type="submit"
              disabled={adding || !newCategory.name}
              className="bg-white text-black px-6 py-2 rounded font-medium disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-indigo border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-storm text-neutral-400">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-storm transition-colors">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-neutral-400">{cat.slug}</td>
                    <td className="p-4 text-neutral-400">{cat.description || '-'}</td>
                    <td className="p-4">
                      {cat.is_public ? (
                        <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded text-xs flex items-center w-fit"><Eye className="w-3 h-3 mr-1" /> Public</span>
                      ) : (
                        <span className="text-red-500 bg-red-500/20 px-2 py-1 rounded text-xs flex items-center w-fit"><EyeOff className="w-3 h-3 mr-1" /> Private</span>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-neutral-400">No categories found.</td>
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

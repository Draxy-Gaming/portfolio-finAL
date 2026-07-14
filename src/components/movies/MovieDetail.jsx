import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MovieDetail() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${identifier}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const data = await response.json();

        // Ensure only public movies are shown to regular visitors
        // For admin it would be different, but this is the public route
        if (!data.is_public) {
          throw new Error('This movie is private');
        }

        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [identifier]);

  if (loading) return <div className="pt-32 text-center text-neutral-400">Loading...</div>;
  if (error) return (
    <div className="pt-32 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/movies')} className="text-blue-500 hover:underline">
        Back to Movies
      </button>
    </div>
  );
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Backdrop Hero */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-primary/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black-100 to-transparent z-10" />
        {movie.backdrop_url ? (
          <img
            src={movie.backdrop_url}
            alt={`${movie.title} Backdrop`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-storm" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 -mt-32 md:-mt-64 pb-12">
        <Link to="/movies" className="inline-flex items-center text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Movies
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-storm">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} className="w-full h-auto object-cover" />
            ) : (
              <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-400">No Poster</div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm md:text-base mb-6">
              <span>{movie.release_year}</span>
              {movie.runtime && (
                <>
                  <span>•</span>
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </>
              )}
              {movie.personal_rating && (
                <>
                  <span>•</span>
                  <span className="text-yellow-500 font-medium">★ {movie.personal_rating}/10</span>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                movie.status === 'favorite' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                movie.status === 'watched' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                'bg-blue-500/10 border-blue-500/30 text-blue-500'
              }`}>
                {movie.status === 'favorite' ? '♥ Favorite' :
                 movie.status === 'watched' ? 'Watched' : 'Watchlist'}
              </span>

              {movie.categories?.map(cat => (
                <span key={cat.id} className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-indigo text-neutral-400">
                  {cat.name}
                </span>
              ))}
            </div>

            <div className="mb-8 max-w-3xl text-neutral-400 leading-relaxed">
              <h3 className="text-white font-semibold mb-2">Overview</h3>
              <p>{movie.overview}</p>
            </div>

            {/* Public Review / Note */}
            {(movie.short_note || movie.full_review) && (
              <div className="max-w-3xl bg-indigo border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">My Review</h3>
                {movie.short_note && <p className="text-neutral-400 italic mb-4">"{movie.short_note}"</p>}
                {movie.full_review && <div className="text-neutral-400 whitespace-pre-wrap">{movie.full_review}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.slug}`} className="group relative block overflow-hidden rounded-xl bg-indigo transition-transform hover:scale-105">
      <div className="aspect-[2/3] w-full bg-storm">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">No Poster</div>
        )}
      </div>

      {/* Overlay Status Badge */}
      <div className="absolute top-2 right-2">
        {movie.status === 'favorite' && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">♥ Favorite</span>}
        {movie.status === 'watched' && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">Watched</span>}
        {movie.status === 'want_to_watch' && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">Watchlist</span>}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold truncate" title={movie.title}>{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-neutral-400 mt-1">
          <span>{movie.release_year}</span>
          {movie.personal_rating && (
            <span className="flex items-center gap-1 text-yellow-500">
              ★ {movie.personal_rating}/10
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

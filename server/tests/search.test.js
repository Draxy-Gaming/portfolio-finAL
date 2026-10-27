import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('TMDB Search API endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // We mock the global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should return 400 when query parameter is missing', async () => {
    const res = await request(app).get('/api/movies/search');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Query parameter is required' });
  });

  it('should return mock data when TMDB_API_KEY is not set', async () => {
    delete process.env.TMDB_API_KEY;
    const query = 'matrix';

    const res = await request(app).get(`/api/movies/search?query=${query}`);
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].title).toBe(`Mock Movie for "${query}"`);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should call fetch and return data when TMDB_API_KEY is set', async () => {
    process.env.TMDB_API_KEY = 'test_api_key';
    const query = 'matrix';

    const mockData = {
      results: [
        { id: 1, title: 'The Matrix' }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const res = await request(app).get(`/api/movies/search?query=${query}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/search/movie?api_key=test_api_key&query=${query}&language=en-US&page=1`
    );
  });

  it('should propagate error from TMDB API when fetch fails with non-ok status', async () => {
    process.env.TMDB_API_KEY = 'test_api_key';
    const query = 'matrix';

    const mockErrorData = { status_message: 'Invalid API key', status_code: 7 };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => mockErrorData
    });

    const res = await request(app).get(`/api/movies/search?query=${query}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual(mockErrorData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return 500 when fetch throws an exception', async () => {
    process.env.TMDB_API_KEY = 'test_api_key';
    const query = 'matrix';

    // Temporarily suppress console.error for this test to keep the output clean
    const originalConsoleError = console.error;
    console.error = vi.fn();

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const res = await request(app).get(`/api/movies/search?query=${query}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to search movies' });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Restore console.error
    console.error = originalConsoleError;
  });
});

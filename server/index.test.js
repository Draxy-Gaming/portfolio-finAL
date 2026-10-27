import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from './index.js';

describe('Server API', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/movies/search', () => {
    it('should return TMDB error when API response is not ok', async () => {
      // Mock the global fetch to return an error response
      const mockErrorData = { status_message: "Invalid API key", success: false, status_code: 7 };
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorData,
      });

      // Provide a query parameter so we don't hit the 400 Bad Request first
      const response = await request(app).get('/api/movies/search?query=inception');

      // Given the logic in the endpoint:
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   return res.status(response.status).json(errorData);
      // }
      // The status should be the status from the TMDB API (401), and the body should be the errorData
      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockErrorData);

      // Ensure fetch was called
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should return 500 when TMDB API fetch rejects/fails entirely', async () => {
      // Mock the global fetch to reject to simulate network failure or other fatal error
      fetchSpy.mockRejectedValue(new Error('Network failure'));

      // Provide a query parameter so we don't hit the 400 Bad Request first
      const response = await request(app).get('/api/movies/search?query=inception');

      // Should hit the catch block and return 500
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to search movies' });

      // Ensure fetch was called
      expect(fetchSpy).toHaveBeenCalled();
    });
  });
});

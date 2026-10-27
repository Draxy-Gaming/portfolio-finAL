import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getAdminSecret, setAdminSecret, clearAdminSecret } from './auth.js';

describe('auth utilities', () => {
  beforeEach(() => {
    // Mock the localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAdminSecret', () => {
    it('returns the secret if it exists in localStorage', () => {
      localStorage.getItem.mockReturnValue('test-secret');
      const result = getAdminSecret();
      expect(localStorage.getItem).toHaveBeenCalledWith('admin_secret');
      expect(result).toBe('test-secret');
    });

    it('returns an empty string if it does not exist in localStorage', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = getAdminSecret();
      expect(localStorage.getItem).toHaveBeenCalledWith('admin_secret');
      expect(result).toBe('');
    });
  });

  describe('setAdminSecret', () => {
    it('sets the admin secret in localStorage', () => {
      setAdminSecret('new-secret');
      expect(localStorage.setItem).toHaveBeenCalledWith('admin_secret', 'new-secret');
    });
  });

  describe('clearAdminSecret', () => {
    it('removes the admin secret from localStorage', () => {
      clearAdminSecret();
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_secret');
    });
  });
});

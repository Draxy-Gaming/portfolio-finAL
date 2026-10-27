import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      TMDB_API_KEY: 'test_key',
    },
  },
});

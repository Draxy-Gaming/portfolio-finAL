import { describe, it, expect } from 'vitest';
import { generateSlug } from './utils.js';

describe('generateSlug', () => {
  it('should generate a simple slug for a regular title', () => {
    expect(generateSlug('The Matrix')).toBe('the-matrix');
  });

  it('should generate a slug with year if provided', () => {
    expect(generateSlug('The Matrix', 1999)).toBe('the-matrix-1999');
  });

  it('should handle mixed casing correctly', () => {
    expect(generateSlug('tHe MaTrIx')).toBe('the-matrix');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Spider-Man: No Way Home!')).toBe('spider-man-no-way-home');
  });

  it('should strip leading and trailing hyphens', () => {
    expect(generateSlug('-Dune-')).toBe('dune');
    expect(generateSlug('---Dune---')).toBe('dune'); // Tests multiple leading/trailing characters replaced by a single hyphen first
  });

  it('should replace multiple consecutive special characters with a single hyphen', () => {
    expect(generateSlug('Alien vs. Predator')).toBe('alien-vs-predator');
    expect(generateSlug('Alien  vs...  Predator')).toBe('alien-vs-predator');
  });

  it('should handle empty strings or spaces', () => {
    expect(generateSlug('   ')).toBe('');
    expect(generateSlug('')).toBe('');
  });

  it('should handle alphanumeric strings only', () => {
    expect(generateSlug('Se7en')).toBe('se7en');
    expect(generateSlug('12 Monkeys')).toBe('12-monkeys');
  });
});

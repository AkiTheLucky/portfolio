import { describe, expect, it } from 'vitest';
import { postSlug } from './blog';

describe('post slugs', () => {
  it('strips the date prefix from a dated filename', () => {
    expect(postSlug('2026-11-04-why-process-beats-tooling')).toBe('why-process-beats-tooling');
  });

  it('leaves undated filenames alone', () => {
    expect(postSlug('half-formed-thoughts')).toBe('half-formed-thoughts');
  });

  it('only strips a real leading date', () => {
    expect(postSlug('notes-from-2026-11-04')).toBe('notes-from-2026-11-04');
    expect(postSlug('2026-11-04')).toBe('2026-11-04');
  });
});

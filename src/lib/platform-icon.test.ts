import { describe, it, expect } from 'vitest';
import { detectPlatformFromUrl } from './platform-icon';

describe('detectPlatformFromUrl', () => {
    it('detects known platforms', () => {
        expect(detectPlatformFromUrl('https://instagram.com/someone')).toBe('instagram');
        expect(detectPlatformFromUrl('https://github.com/someone')).toBe('github');
        expect(detectPlatformFromUrl('https://x.com/someone')).toBe('twitter');
    });

    it('returns null for an unrecognized domain', () => {
        expect(detectPlatformFromUrl('https://my-personal-site.example')).toBeNull();
    });

    it('returns null for a malformed URL', () => {
        expect(detectPlatformFromUrl('not-a-url')).toBeNull();
    });
});

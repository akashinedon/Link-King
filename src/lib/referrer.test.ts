import { describe, it, expect } from 'vitest';
import { parseReferrer } from './referrer';

describe('parseReferrer', () => {
    it('returns Direct when there is no referer', () => {
        expect(parseReferrer(null)).toBe('Direct');
    });

    it('recognizes known social platforms', () => {
        expect(parseReferrer('https://www.instagram.com/foo')).toBe('Instagram');
        expect(parseReferrer('https://x.com/foo')).toBe('Twitter / X');
        expect(parseReferrer('https://m.youtube.com/watch')).toBe('YouTube');
    });

    it('falls back to the bare hostname for unknown referrers', () => {
        expect(parseReferrer('https://www.someblog.example/post')).toBe('someblog.example');
    });

    it('returns Other for a malformed referer', () => {
        expect(parseReferrer('not-a-url')).toBe('Other');
    });
});

import { describe, it, expect } from 'vitest';
import { suggestLinkTitle } from './link-copy';

describe('suggestLinkTitle', () => {
    it('returns a catchy title for a known platform', () => {
        expect(suggestLinkTitle('github')).toMatch(/code/i);
        expect(suggestLinkTitle('instagram')).toMatch(/Instagram/);
    });

    it('returns null for an unknown or missing platform', () => {
        expect(suggestLinkTitle('myspace')).toBeNull();
        expect(suggestLinkTitle(null)).toBeNull();
    });
});

import { describe, it, expect } from 'vitest';
import { isRateLimited } from './rate-limit';

describe('isRateLimited', () => {
    it('allows requests under the limit', () => {
        const key = `test-${Math.random()}`;
        expect(isRateLimited(key, 3, 1000)).toBe(false);
        expect(isRateLimited(key, 3, 1000)).toBe(false);
        expect(isRateLimited(key, 3, 1000)).toBe(false);
    });

    it('blocks requests once the limit is hit within the window', () => {
        const key = `test-${Math.random()}`;
        isRateLimited(key, 2, 1000);
        isRateLimited(key, 2, 1000);
        expect(isRateLimited(key, 2, 1000)).toBe(true);
    });

    it('tracks separate keys independently', () => {
        const keyA = `test-a-${Math.random()}`;
        const keyB = `test-b-${Math.random()}`;
        isRateLimited(keyA, 1, 1000);
        expect(isRateLimited(keyA, 1, 1000)).toBe(true);
        expect(isRateLimited(keyB, 1, 1000)).toBe(false);
    });
});

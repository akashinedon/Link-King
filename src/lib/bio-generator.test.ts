import { describe, it, expect } from 'vitest';
import { generateBios } from './bio-generator';

describe('generateBios', () => {
    it('returns an empty array for blank input', () => {
        expect(generateBios('', 'friendly')).toEqual([]);
        expect(generateBios('   ', 'professional')).toEqual([]);
    });

    it('generates multiple candidates for valid keywords', () => {
        const bios = generateBios('developer, react, coffee', 'friendly');
        expect(bios.length).toBeGreaterThan(0);
        for (const bio of bios) {
            expect(typeof bio).toBe('string');
            expect(bio.length).toBeGreaterThan(0);
        }
    });

    it('picks a keyword-relevant emoji', () => {
        const bios = generateBios('developer, coffee', 'friendly');
        expect(bios[0]).toContain('💻');
    });

    it('minimal tone stays emoji-free', () => {
        const bios = generateBios('designer, minimalist', 'minimal');
        // Emoji from EMOJI_BY_KEYWORD are made of surrogate pairs (high
        // surrogate range below) - checking for one avoids needing the
        // regex `u` flag, which this project's TS target doesn't support.
        for (const bio of bios) {
            expect(bio).not.toMatch(/[\uD800-\uDBFF]/);
        }
    });
});

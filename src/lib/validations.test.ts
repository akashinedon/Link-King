import { describe, it, expect } from 'vitest';
import { linkCreateSchema, linkUpdateSchema, usernameSchema, profileUpdateSchema } from './validations';

describe('linkCreateSchema', () => {
    it('accepts a valid http(s) link', () => {
        const result = linkCreateSchema.safeParse({ title: 'My site', url: 'https://example.com' });
        expect(result.success).toBe(true);
    });

    it('rejects javascript: URLs', () => {
        const result = linkCreateSchema.safeParse({ title: 'XSS', url: 'javascript:alert(1)' });
        expect(result.success).toBe(false);
    });

    it('rejects a missing title', () => {
        const result = linkCreateSchema.safeParse({ title: '', url: 'https://example.com' });
        expect(result.success).toBe(false);
    });
});

describe('linkUpdateSchema', () => {
    it('allows a partial update with only isActive', () => {
        const result = linkUpdateSchema.safeParse({ isActive: false });
        expect(result.success).toBe(true);
    });

    it('does not allow reassigning userId/clicks/order (not in schema)', () => {
        const result = linkUpdateSchema.safeParse({ userId: 'someone-else', clicks: 999999 } as any);
        // Unknown keys are stripped by default zod object parsing, not rejected -
        // the important guarantee is that `data` returned below never contains them.
        expect(result.success).toBe(true);
        expect((result as any).data).not.toHaveProperty('userId');
        expect((result as any).data).not.toHaveProperty('clicks');
    });
});

describe('usernameSchema', () => {
    it('accepts a valid username', () => {
        expect(usernameSchema.safeParse('cool_user123').success).toBe(true);
    });

    it('rejects usernames with special characters', () => {
        expect(usernameSchema.safeParse('not valid!').success).toBe(false);
    });

    it('rejects usernames shorter than 3 characters', () => {
        expect(usernameSchema.safeParse('ab').success).toBe(false);
    });
});

describe('profileUpdateSchema', () => {
    it('allows clearing the avatar with an empty string', () => {
        expect(profileUpdateSchema.safeParse({ avatar: '' }).success).toBe(true);
    });

    it('rejects a bio longer than 200 characters', () => {
        const result = profileUpdateSchema.safeParse({ bio: 'a'.repeat(201) });
        expect(result.success).toBe(false);
    });
});

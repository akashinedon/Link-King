import { z } from 'zod';

// Only http(s) URLs are allowed as link targets. This blocks `javascript:`,
// `data:`, and other schemes that would otherwise be stored verbatim and
// rendered as an <a href> on the public profile page.
const httpUrl = z
    .string()
    .trim()
    .min(1, 'URL is required')
    .refine(
        (value) => {
            try {
                const parsed = new URL(value);
                return parsed.protocol === 'http:' || parsed.protocol === 'https:';
            } catch {
                return false;
            }
        },
        { message: 'URL must be a valid http:// or https:// address' }
    );

export const linkCreateSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
    url: httpUrl,
    icon: z.string().trim().max(500).optional().nullable(),
});

// Whitelist of fields a client is allowed to change via PUT /api/links/[id].
// Deliberately excludes id, userId, clicks, and order so a crafted request
// body can't reassign ownership or forge analytics counters.
export const linkUpdateSchema = z
    .object({
        title: z.string().trim().min(1).max(100),
        url: httpUrl,
        icon: z.string().trim().max(500).nullable(),
        isActive: z.boolean(),
        isFeatured: z.boolean(),
    })
    .partial();

export const linksReorderSchema = z.object({
    links: z
        .array(
            z.object({
                id: z.string().min(1),
                order: z.number().int().min(0),
            })
        )
        .min(1),
});

export const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username is too long')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const profileUpdateSchema = z.object({
    name: z.string().trim().max(100).optional(),
    bio: z.string().trim().max(200).optional().nullable(),
    avatar: z.string().trim().url().optional().nullable().or(z.literal('')),
    theme: z.enum(['default', 'dark', 'gradient', 'glass', 'neon', 'minimal']).optional(),
    username: usernameSchema.optional(),
});

/** Formats the first Zod issue into a short, user-facing message. */
export function firstZodError(error: z.ZodError): string {
    return error.issues[0]?.message ?? 'Invalid input';
}

// Keys must match `iconMap` in `src/components/public-profile/profile-links.tsx`
// and the `name` values in `PRESET_ICONS` in `src/components/dashboard/icon-picker.tsx`.
const PLATFORM_PATTERNS: { pattern: RegExp; icon: string }[] = [
    { pattern: /instagram\.com/, icon: 'instagram' },
    { pattern: /(twitter\.com|x\.com)/, icon: 'twitter' },
    { pattern: /youtube\.com|youtu\.be/, icon: 'youtube' },
    { pattern: /github\.com/, icon: 'github' },
    { pattern: /linkedin\.com/, icon: 'linkedin' },
    { pattern: /facebook\.com/, icon: 'facebook' },
    { pattern: /wa\.me|whatsapp\.com/, icon: 'whatsapp' },
    { pattern: /t\.me|telegram\.org/, icon: 'telegram' },
    { pattern: /open\.spotify\.com|spotify\.com/, icon: 'spotify' },
    { pattern: /twitch\.tv/, icon: 'twitch' },
    { pattern: /ko-fi\.com/, icon: 'kofi' },
];

/**
 * Guesses a preset icon key from a pasted link URL, e.g.
 * "https://instagram.com/foo" -> "instagram". Returns null when nothing
 * matches so callers can leave the icon field untouched.
 */
export function detectPlatformFromUrl(url: string): string | null {
    try {
        const hostname = new URL(url).hostname;
        const match = PLATFORM_PATTERNS.find(({ pattern }) => pattern.test(hostname));
        return match?.icon ?? null;
    } catch {
        return null;
    }
}

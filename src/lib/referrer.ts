const KNOWN_SOURCES: { pattern: RegExp; label: string }[] = [
    { pattern: /instagram\.com/, label: 'Instagram' },
    { pattern: /(twitter\.com|x\.com|t\.co)/, label: 'Twitter / X' },
    { pattern: /facebook\.com|fb\.com/, label: 'Facebook' },
    { pattern: /tiktok\.com/, label: 'TikTok' },
    { pattern: /youtube\.com|youtu\.be/, label: 'YouTube' },
    { pattern: /linkedin\.com/, label: 'LinkedIn' },
    { pattern: /reddit\.com/, label: 'Reddit' },
    { pattern: /google\./, label: 'Google' },
    { pattern: /whatsapp\.com|wa\.me/, label: 'WhatsApp' },
    { pattern: /telegram\.org|t\.me/, label: 'Telegram' },
];

/** Buckets a raw `Referer` header into a human-readable traffic source. */
export function parseReferrer(referer: string | null): string {
    if (!referer) return 'Direct';

    try {
        const hostname = new URL(referer).hostname;
        const known = KNOWN_SOURCES.find(({ pattern }) => pattern.test(hostname));
        return known?.label ?? hostname.replace(/^www\./, '');
    } catch {
        return 'Other';
    }
}

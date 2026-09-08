/**
 * Rule-based bio generator - not an LLM call. It mixes user-supplied
 * keywords into hand-written templates with a bit of keyword-aware emoji
 * picking, so results feel tailored without any external API/cost.
 */
export type BioTone = 'professional' | 'friendly' | 'minimal' | 'bold';

const EMOJI_BY_KEYWORD: { pattern: RegExp; emoji: string }[] = [
    { pattern: /develop|engineer|code|programm/i, emoji: '💻' },
    { pattern: /design/i, emoji: '🎨' },
    { pattern: /music|musician|dj|produc/i, emoji: '🎵' },
    { pattern: /photo/i, emoji: '📸' },
    { pattern: /write|writer|author|blog/i, emoji: '✍️' },
    { pattern: /coffee/i, emoji: '☕' },
    { pattern: /travel/i, emoji: '✈️' },
    { pattern: /fitness|gym|run/i, emoji: '💪' },
    { pattern: /food|chef|cook/i, emoji: '🍳' },
    { pattern: /market|growth/i, emoji: '📈' },
    { pattern: /found|startup|entrepreneur/i, emoji: '🚀' },
    { pattern: /teach|educat|mentor/i, emoji: '🎓' },
    { pattern: /game|gamer|gaming/i, emoji: '🎮' },
    { pattern: /art|artist/i, emoji: '🖌️' },
];

const TEMPLATES: Record<BioTone, ((keywords: string[]) => string)[]> = {
    professional: [
        (k) => `${cap(k[0])} focused on ${join(k.slice(1))}. Let's connect.`,
        (k) => `Helping people with ${join(k)}. Links below.`,
        (k) => `${cap(k[0])} | ${join(k.slice(1)) || 'building things that matter'}.`,
    ],
    friendly: [
        (k) => `Hey! I'm into ${join(k)} - glad you're here 👋`,
        (k) => `${cap(k[0])} by day, ${k[1] || 'curious human'} always. Come say hi!`,
        (k) => `A little bit of ${join(k)}, all in one place ✨`,
    ],
    minimal: [
        (k) => join(k, ' · '),
        (k) => `${cap(k[0])}.`,
        (k) => k.map(cap).join(' / '),
    ],
    bold: [
        (k) => `${cap(k[0]).toUpperCase()}. ${join(k.slice(1)).toUpperCase() || 'NO LIMITS'}.`,
        (k) => `Turning ${k[0] || 'ideas'} into reality. Watch this space.`,
        (k) => `${cap(k[0])} with an edge. Everything you need is below.`,
    ],
};

function cap(word: string | undefined): string {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function join(words: string[], separator = ', '): string {
    return words.filter(Boolean).join(separator);
}

function pickEmoji(keywords: string[]): string {
    for (const keyword of keywords) {
        const match = EMOJI_BY_KEYWORD.find(({ pattern }) => pattern.test(keyword));
        if (match) return match.emoji;
    }
    return '✨';
}

/** Generates a handful of bio candidates from free-text keywords. */
export function generateBios(rawKeywords: string, tone: BioTone): string[] {
    const keywords = rawKeywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

    if (keywords.length === 0) return [];

    const emoji = pickEmoji(keywords);
    return TEMPLATES[tone].map((template) => {
        const bio = template(keywords);
        // Minimal tone stays emoji-free on purpose - it's meant to read as terse.
        return tone === 'minimal' ? bio : `${emoji} ${bio}`;
    });
}

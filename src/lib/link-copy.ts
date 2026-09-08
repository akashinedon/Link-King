// Keyed the same as `detectPlatformFromUrl` in src/lib/platform-icon.ts.
const CATCHY_TITLES: Record<string, string> = {
    instagram: '📸 Peek my life on Instagram',
    twitter: '🐦 Follow me on X',
    youtube: '▶️ Watch my latest videos',
    github: '💻 Check out my code',
    linkedin: '🤝 Let\'s connect on LinkedIn',
    facebook: '👋 Say hi on Facebook',
    whatsapp: '💬 Chat with me on WhatsApp',
    telegram: '✈️ Message me on Telegram',
    spotify: '🎧 Listen to my playlists',
    twitch: '🎮 Catch me live on Twitch',
    kofi: '☕ Buy me a coffee',
};

/** Suggests a catchy link title for a detected platform, or null if unknown. */
export function suggestLinkTitle(platform: string | null): string | null {
    if (!platform) return null;
    return CATCHY_TITLES[platform] ?? null;
}

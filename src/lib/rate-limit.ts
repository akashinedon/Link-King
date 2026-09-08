/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Caveat: this state lives in the Node process, so it resets on cold start
 * and isn't shared across concurrent serverless instances/regions. That's
 * an acceptable trade-off here to stop naive click-spam and refresh-bots
 * without adding an external dependency (e.g. Upstash Redis) - swap this
 * out for a shared store if you need accuracy under real multi-instance load.
 */
const hits = new Map<string, number[]>();

// Periodically drop stale keys so this map doesn't grow forever on a
// long-lived process.
const MAX_TRACKED_KEYS = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (timestamps.length >= limit) {
        hits.set(key, timestamps);
        return true;
    }

    timestamps.push(now);
    hits.set(key, timestamps);

    if (hits.size > MAX_TRACKED_KEYS) {
        const oldestKey = hits.keys().next().value;
        if (oldestKey) hits.delete(oldestKey);
    }

    return false;
}

/** Best-effort client IP extraction behind Vercel's proxy. */
export function getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();
    return headers.get('x-real-ip') || 'unknown';
}

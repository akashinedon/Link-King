/**
 * Reads the visitor's country from Vercel's edge-injected geo headers.
 * Falls back to null locally / on other hosts, so analytics simply show
 * "Unknown" instead of breaking.
 */
export function getCountryFromHeaders(headers: Headers): string | null {
    return headers.get('x-vercel-ip-country') || null;
}

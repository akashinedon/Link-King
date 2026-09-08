export type DeviceType = 'Mobile' | 'Tablet' | 'Desktop' | 'Unknown';

/** Lightweight UA sniffing - good enough for a device-mix breakdown chart. */
export function parseDevice(userAgent: string | null): DeviceType {
    if (!userAgent) return 'Unknown';
    const ua = userAgent.toLowerCase();

    if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return 'Tablet';
    if (/mobi|iphone|ipod|android/.test(ua)) return 'Mobile';
    return 'Desktop';
}

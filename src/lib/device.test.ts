import { describe, it, expect } from 'vitest';
import { parseDevice } from './device';

const IPHONE_UA =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
const ANDROID_PHONE_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

describe('parseDevice', () => {
    it('returns Unknown for a null user agent', () => {
        expect(parseDevice(null)).toBe('Unknown');
    });

    it('detects mobile phones', () => {
        expect(parseDevice(IPHONE_UA)).toBe('Mobile');
        expect(parseDevice(ANDROID_PHONE_UA)).toBe('Mobile');
    });

    it('detects tablets', () => {
        expect(parseDevice(IPAD_UA)).toBe('Tablet');
    });

    it('detects desktop', () => {
        expect(parseDevice(DESKTOP_UA)).toBe('Desktop');
    });
});

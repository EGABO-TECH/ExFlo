import { describe, it, expect } from 'vitest';
import { calculateDistance, verifyPresence } from '../services/geofencing/haversine';

describe('Geofencing Service: Haversine Logic', () => {
    it('calculates the correct distance between identical points to be 0', () => {
        const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
        expect(distance).toBe(0);
    });

    it('calculates the Haversine distance for nearby coordinates accurately (~111 meters per 0.001 degree of latitude)', () => {
        const d = calculateDistance(0, 0, 0.001, 0); 
        // 0.001 degrees of latitude is approximately 111.19 meters
        expect(d).toBeGreaterThan(111);
        expect(d).toBeLessThan(112);
    });

    it('verifyPresence returns true when distance is less than the specified radius', () => {
        // Target is ~111m away. Radius is 200m.
        const isPresent = verifyPresence(0, 0, 0.001, 0, 200);
        expect(isPresent).toBe(true);
    });

    it('verifyPresence returns false when distance is greater than the specified radius', () => {
        // Target is ~222m away. Radius is 200m.
        const isPresent = verifyPresence(0, 0, 0.002, 0, 200);
        expect(isPresent).toBe(false);
    });

    it('verifyPresence uses the default parameter of 200m when radius is omitted', () => {
        // Should be true for 111m under default 200m radius
        expect(verifyPresence(0, 0, 0.001, 0)).toBe(true);
        // Should be false for 222m under default 200m radius
        expect(verifyPresence(0, 0, 0.002, 0)).toBe(false);
    });
});

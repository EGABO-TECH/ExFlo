import { getDistance } from 'geolib';

/**
 * Trustless Check-in Agent (AI Oracle)
 * Verifies if the user's coordinates match the booking's coordinates within 200m.
 */

// Simulated coordinates (e.g., from Duffel/TripAdvisor data)
const BOOKING_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  "stay_1": { latitude: 48.8566, longitude: 2.3522 }, // Paris Grand Hotel ExFlo
  "tour_1": { latitude: 48.8584, longitude: 2.2945 }, // Eiffel Tower
};

export const verifyPresence = async (bookingId: string, currentCoords: { latitude: number, longitude: number }) => {
  const targetLocation = BOOKING_COORDINATES[bookingId];
  if (!targetLocation) {
    throw new Error(`Booking ID ${bookingId} not found in verified records.`);
  }

  const distanceMeters = getDistance(
    { latitude: currentCoords.latitude, longitude: currentCoords.longitude },
    { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
  );

  console.log(`Agent Checking Presence: Distance to ${bookingId} is ${distanceMeters}m`);

  if (distanceMeters <= 200) {
    console.log(`Match Verified! Haversine distance < 200m. Triggering Oracle Smart Contract Call.`);
    return { verified: true, distance: distanceMeters };
  } else {
    console.log(`Verification Failed. Found ${distanceMeters}m > 200m.`);
    return { verified: false, distance: distanceMeters };
  }
};

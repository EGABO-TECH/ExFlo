/**
 * Calculates the Haversine distance between two sets of GPS coordinates.
 * @param lat1 Latitude of point 1 (in decimal degrees)
 * @param lon1 Longitude of point 1 (in decimal degrees)
 * @param lat2 Latitude of point 2 (in decimal degrees)
 * @param lon2 Longitude of point 2 (in decimal degrees)
 * @returns The distance between the points in meters.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's mean radius in meters
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
    // c is the angular distance in radians
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Verifies if the user is present at the target destination within an allowable radius.
 * @param currentLat User's current latitude
 * @param currentLon User's current longitude
 * @param destLat Target destination latitude
 * @param destLon Target destination longitude
 * @param radiusInMeters Optional radius in meters defining "presence". Defaults to 200m.
 * @returns Boolean denoting if the user is within the radius.
 */
export function verifyPresence(
    currentLat: number, 
    currentLon: number, 
    destLat: number, 
    destLon: number, 
    radiusInMeters: number = 200
): boolean {
    const distance = calculateDistance(currentLat, currentLon, destLat, destLon);
    return distance <= radiusInMeters;
}

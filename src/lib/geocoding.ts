// Geocoding utility to get zone/area name from GPS coordinates

// Define Johannesburg zones with their boundaries
const JOHANNESBURG_ZONES = [
  { name: "Sandton CBD", lat: -26.107407, lng: 28.056229, radius: 0.015 },
  { name: "Midrand", lat: -25.989460, lng: 28.125280, radius: 0.020 },
  { name: "Rosebank", lat: -26.147886, lng: 28.042421, radius: 0.012 },
  { name: "Melville", lat: -26.184167, lng: 28.011667, radius: 0.010 },
  { name: "Randburg", lat: -26.094444, lng: 27.981389, radius: 0.015 },
  { name: "Braamfontein", lat: -26.195246, lng: 28.034088, radius: 0.010 },
  { name: "Bedfordview", lat: -26.133056, lng: 28.088333, radius: 0.015 },
  { name: "Cyrildene", lat: -26.172222, lng: 28.078333, radius: 0.012 },
  { name: "Parktown", lat: -26.121667, lng: 28.013889, radius: 0.010 },
  { name: "Hyde Park", lat: -26.068889, lng: 28.026667, radius: 0.012 },
  { name: "Germiston", lat: -26.153333, lng: 28.120556, radius: 0.018 },
  { name: "Alexandra", lat: -26.087778, lng: 28.097222, radius: 0.015 },
  { name: "Fourways", lat: -26.012222, lng: 28.010556, radius: 0.020 },
  { name: "Rivonia", lat: -26.053611, lng: 28.058889, radius: 0.012 },
  { name: "Sunninghill", lat: -26.035556, lng: 28.083333, radius: 0.012 },
  { name: "Morningside", lat: -26.087500, lng: 28.065833, radius: 0.010 },
  { name: "Illovo", lat: -26.132500, lng: 28.052778, radius: 0.008 },
  { name: "Parkview", lat: -26.161389, lng: 28.033056, radius: 0.008 },
  { name: "Houghton", lat: -26.148056, lng: 28.060278, radius: 0.010 },
  { name: "Observatory", lat: -26.189722, lng: 28.079722, radius: 0.010 },
];

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * Returns distance in degrees (approximate)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Get zone name from GPS coordinates
 * Returns the nearest zone name based on distance
 */
export function getZoneFromCoordinates(lat: number, lng: number): string {
  let closestZone = "Johannesburg"; // Default fallback
  let minDistance = Infinity;

  for (const zone of JOHANNESBURG_ZONES) {
    const distance = calculateDistance(lat, lng, zone.lat, zone.lng);
    
    // Check if within zone radius
    if (distance <= zone.radius && distance < minDistance) {
      closestZone = zone.name;
      minDistance = distance;
    }
  }

  // If not within any specific zone radius, find nearest zone
  if (closestZone === "Johannesburg") {
    for (const zone of JOHANNESBURG_ZONES) {
      const distance = calculateDistance(lat, lng, zone.lat, zone.lng);
      if (distance < minDistance) {
        closestZone = zone.name;
        minDistance = distance;
      }
    }
  }

  return closestZone;
}

/**
 * Update driver zone based on current coordinates
 */
export function updateDriverZone(driver: { lat: number; lng: number; zone?: string }): string {
  return getZoneFromCoordinates(driver.lat, driver.lng);
}

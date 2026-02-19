// Google Roads API utilities for snapping positions to roads
// This ensures motorbikes always stay on the road network

const ROADS_API_KEY = import.meta.env.VITE_GOOGLE_ROADS_API_KEY || "AIzaSyA3YNzpG8zsCR5KwC_yRAsJzRIs8TaRdsA";

interface LatLng {
  lat: number;
  lng: number;
}

interface SnappedPoint {
  location: {
    latitude: number;
    longitude: number;
  };
  originalIndex: number;
  placeId: string;
}

/**
 * Snaps a single GPS coordinate to the nearest road
 * Uses Google Roads API - Snap to Roads
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Snapped coordinates or original if API fails
 */
export async function snapToRoad(lat: number, lng: number): Promise<LatLng> {
  try {
    const url = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${ROADS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Roads API request failed:', response.status);
      return { lat, lng }; // Return original position
    }
    
    const data = await response.json();
    
    if (data.snappedPoints && data.snappedPoints.length > 0) {
      const snapped = data.snappedPoints[0];
      return {
        lat: snapped.location.latitude,
        lng: snapped.location.longitude
      };
    }
    
    return { lat, lng };
  } catch (error) {
    console.error('Error snapping to road:', error);
    return { lat, lng }; // Fallback to original position
  }
}

/**
 * Snaps multiple GPS coordinates to the nearest roads
 * More efficient than calling snapToRoad multiple times
 * 
 * @param points - Array of lat/lng coordinates
 * @returns Array of snapped coordinates
 */
export async function snapToRoads(points: LatLng[]): Promise<LatLng[]> {
  if (points.length === 0) return [];
  
  try {
    // Roads API accepts up to 100 points
    const maxPoints = Math.min(points.length, 100);
    const pathString = points
      .slice(0, maxPoints)
      .map(p => `${p.lat},${p.lng}`)
      .join('|');
    
    const url = `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${ROADS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Roads API batch request failed:', response.status);
      return points; // Return original positions
    }
    
    const data = await response.json();
    
    if (data.snappedPoints && data.snappedPoints.length > 0) {
      return data.snappedPoints.map((snapped: SnappedPoint) => ({
        lat: snapped.location.latitude,
        lng: snapped.location.longitude
      }));
    }
    
    return points;
  } catch (error) {
    console.error('Error snapping to roads:', error);
    return points; // Fallback to original positions
  }
}

/**
 * Snaps route waypoints to roads with interpolation
 * This fills in missing points along the route
 * 
 * @param waypoints - Array of route waypoints
 * @returns Snapped and interpolated waypoints
 */
export async function snapRouteToRoads(waypoints: LatLng[]): Promise<LatLng[]> {
  if (waypoints.length < 2) return waypoints;
  
  try {
    // Process in batches of 100 points (Roads API limit)
    const batchSize = 100;
    const snappedBatches: LatLng[] = [];
    
    for (let i = 0; i < waypoints.length; i += batchSize) {
      const batch = waypoints.slice(i, i + batchSize);
      const pathString = batch.map(p => `${p.lat},${p.lng}`).join('|');
      
      const url = `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${ROADS_API_KEY}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.snappedPoints) {
          const snapped = data.snappedPoints.map((p: SnappedPoint) => ({
            lat: p.location.latitude,
            lng: p.location.longitude
          }));
          snappedBatches.push(...snapped);
        }
      }
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < waypoints.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return snappedBatches.length > 0 ? snappedBatches : waypoints;
  } catch (error) {
    console.error('Error snapping route to roads:', error);
    return waypoints;
  }
}

/**
 * Gets the nearest road for a given coordinate
 * Returns road information including place ID
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Road information or null if not found
 */
export async function getNearestRoad(lat: number, lng: number): Promise<{
  location: LatLng;
  placeId: string;
} | null> {
  try {
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${ROADS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.snappedPoints && data.snappedPoints.length > 0) {
      const point = data.snappedPoints[0];
      return {
        location: {
          lat: point.location.latitude,
          lng: point.location.longitude
        },
        placeId: point.placeId
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting nearest road:', error);
    return null;
  }
}

/**
 * Validates if a coordinate is on a road
 * Returns true if the point can be snapped to a nearby road
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @param maxDistance - Maximum distance in meters to consider "on road"
 * @returns Boolean indicating if point is on a road
 */
export async function isOnRoad(lat: number, lng: number, maxDistance = 50): Promise<boolean> {
  try {
    const snapped = await snapToRoad(lat, lng);
    
    // Calculate distance between original and snapped point
    const distance = calculateDistance(lat, lng, snapped.lat, snapped.lng);
    
    return distance <= maxDistance;
  } catch (error) {
    console.error('Error checking if on road:', error);
    return false;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default {
  snapToRoad,
  snapToRoads,
  snapRouteToRoads,
  getNearestRoad,
  isOnRoad
};

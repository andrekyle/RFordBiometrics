import { useState, useEffect, useRef } from "react";
import { drivers as initialDrivers, Driver } from "@/lib/mock-data";
import { getZoneFromCoordinates } from "@/lib/geocoding";

interface RoutePoint {
  lat: number;
  lng: number;
}

interface SnappedPositionCache {
  position: RoutePoint;
  timestamp: number;
}

interface DriverRoute {
  waypoints: RoutePoint[];
  currentIndex: number;
  progress: number; // Progress along current segment (0-1)
  speed: number; // Current speed in km/h
  targetSpeed: number; // Target speed for this driver (respects speed limits)
  isLoading: boolean;
  lastUpdateTime: number; // Timestamp of last position update
  snappedCache?: SnappedPositionCache; // Cache for snapped positions
}

// Calculate real distance between two GPS coordinates using Haversine formula
// Returns distance in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Interpolate between two points based on fraction (0-1)
// This ensures smooth movement along road segments
function interpolatePoint(p1: RoutePoint, p2: RoutePoint, fraction: number): RoutePoint {
  // Clamp fraction to [0, 1] to ensure we stay within the segment
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  
  return {
    lat: p1.lat + (p2.lat - p1.lat) * clampedFraction,
    lng: p1.lng + (p2.lng - p1.lng) * clampedFraction
  };
}

// Calculate next position along route, smoothly interpolating between waypoints
// This ensures bikes stick to roads and move at realistic speeds
function calculateNextPosition(
  waypoints: RoutePoint[],
  currentIndex: number,
  progress: number, // Progress along current segment (0-1)
  speedKmh: number,
  timeIntervalSeconds: number
): { newIndex: number; newProgress: number; position: RoutePoint; actualSpeed: number } {
  
  if (waypoints.length < 2) {
    return {
      newIndex: currentIndex,
      newProgress: progress,
      position: waypoints[0],
      actualSpeed: 0
    };
  }
  
  // Distance to travel in this interval (in meters)
  const targetDistanceMeters = (speedKmh * 1000 / 3600) * timeIntervalSeconds;
  
  let distanceRemaining = targetDistanceMeters;
  let currentIdx = currentIndex;
  let currentProgress = progress;
  let totalDistanceTraveled = 0;
  
  // Move along the route until we've covered the target distance
  while (distanceRemaining > 0.1 && totalDistanceTraveled < targetDistanceMeters * 2) {
    const p1 = waypoints[currentIdx % waypoints.length];
    const p2 = waypoints[(currentIdx + 1) % waypoints.length];
    
    // Distance of current segment
    const segmentDistance = calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng);
    
    // Skip zero-distance segments (duplicate waypoints)
    if (segmentDistance < 0.1) {
      currentIdx = (currentIdx + 1) % waypoints.length;
      currentProgress = 0;
      continue;
    }
    
    // Distance remaining in current segment
    const remainingInSegment = segmentDistance * (1 - currentProgress);
    
    if (distanceRemaining < remainingInSegment) {
      // We'll stop within this segment
      const fractionToMove = distanceRemaining / segmentDistance;
      currentProgress += fractionToMove;
      // Ensure progress stays within [0, 1]
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      totalDistanceTraveled += distanceRemaining;
      distanceRemaining = 0;
    } else {
      // Move to next segment
      distanceRemaining -= remainingInSegment;
      totalDistanceTraveled += remainingInSegment;
      currentIdx = (currentIdx + 1) % waypoints.length;
      currentProgress = 0;
    }
    
    // Safety break to prevent infinite loop
    if (currentIdx === currentIndex && currentProgress === progress) {
      break;
    }
  }
  
  // Calculate actual position by interpolating
  const p1 = waypoints[currentIdx % waypoints.length];
  const p2 = waypoints[(currentIdx + 1) % waypoints.length];
  const position = interpolatePoint(p1, p2, currentProgress);
  
  // VALIDATION: Ensure waypoints are valid
  if (!p1 || !p2 || isNaN(p1.lat) || isNaN(p1.lng) || isNaN(p2.lat) || isNaN(p2.lng)) {
    console.error('Invalid waypoints detected, returning first waypoint');
    return {
      newIndex: 0,
      newProgress: 0,
      position: waypoints[0],
      actualSpeed: 0
    };
  }
  
  // Calculate actual speed achieved
  const actualSpeed = (totalDistanceTraveled / 1000) / (timeIntervalSeconds / 3600);
  
  return {
    newIndex: currentIdx % waypoints.length,
    newProgress: currentProgress,
    position,
    actualSpeed
  };
}

// Major road intersections in Johannesburg for route generation
const routeDestinations: RoutePoint[] = [
  { lat: -26.107407, lng: 28.056229 }, // Sandton CBD
  { lat: -26.133056, lng: 28.088333 }, // Bedfordview
  { lat: -26.172222, lng: 28.078333 }, // Cyrildene
  { lat: -26.195246, lng: 28.034088 }, // Braamfontein
  { lat: -26.184167, lng: 28.011667 }, // Melville
  { lat: -26.147886, lng: 28.042421 }, // Rosebank
  { lat: -26.121667, lng: 28.013889 }, // Parktown
  { lat: -26.068889, lng: 28.026667 }, // Hyde Park
  { lat: -26.087778, lng: 28.097222 }, // Alexandra
  { lat: -26.153333, lng: 28.120556 }, // Germiston
];

// Decode Google's polyline format to get road coordinates
function decodePolyline(encoded: string): RoutePoint[] {
  const points: RoutePoint[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return points;
}

// Fetch real route between two points using Google Directions API
async function fetchRoadRoute(origin: RoutePoint, destination: RoutePoint): Promise<RoutePoint[]> {
  try {
    // Use DirectionsService from Google Maps (already loaded in browser)
    if (typeof google !== 'undefined' && google.maps) {
      return new Promise((resolve) => {
        const directionsService = new google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              const points: RoutePoint[] = [];
              
              // Extract all points from the route
              result.routes[0].legs.forEach((leg) => {
                leg.steps.forEach((step) => {
                  // Decode the polyline to get detailed road path
                  const stepPoints = decodePolyline(step.polyline.points);
                  points.push(...stepPoints);
                });
              });
              
              // Use ALL points for maximum road accuracy (no sampling)
              // This ensures bikes follow roads precisely
              
              // Validate we have actual road data (not just 2 points)
              if (points.length < 3) {
                console.error('Route has too few points, this is not a real road route!');
              }
              
              resolve(points.length > 0 ? points : [origin, destination]);
            } else {
              console.error('Directions request failed:', status);
              // Don't use fallback - wait and retry
              resolve([]);
            }
          }
        );
      });
    }
  } catch (error) {
    console.error('Error fetching road route:', error);
  }
  
  // Fallback if Google Maps not loaded
  return [];
}

// Generate a circular route through multiple destinations
async function generateDriverRoute(startIndex: number): Promise<RoutePoint[]> {
  const allPoints: RoutePoint[] = [];
  
  // Generate a simple loop: start -> dest1 -> start (2 legs only to reduce API calls)
  const originIndex = startIndex % routeDestinations.length;
  const destIndex = (startIndex + 1) % routeDestinations.length;
  
  const origin = routeDestinations[originIndex];
  const dest = routeDestinations[destIndex];
  
  // Leg 1: origin to destination
  const routeSegment = await fetchRoadRoute(origin, dest);
  
  if (routeSegment.length > 2) {
    allPoints.push(...routeSegment);
    
    // Leg 2: return trip
    const returnRoute = await fetchRoadRoute(dest, origin);
    
    if (returnRoute.length > 2) {
      allPoints.push(...returnRoute);
    }
  }
  
  return allPoints;
}

export function useRoadBasedSimulation(intervalMs = 1000) {
  const [liveDrivers, setLiveDrivers] = useState<Driver[]>(initialDrivers);
  const routesRef = useRef<Map<string, DriverRoute>>(new window.Map());
  const initializingRef = useRef(false);
  const [routesLoaded, setRoutesLoaded] = useState(false);

  // Initialize routes for all drivers
  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    // Wait a bit for Google Maps to load
    const initTimeout = setTimeout(async () => {
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps not loaded yet, retrying...');
        initializingRef.current = false;
        return;
      }

      // Generate routes for all drivers sequentially to avoid rate limiting
      for (let i = 0; i < initialDrivers.length; i++) {
        const driver = initialDrivers[i];
        const startIndex = i % routeDestinations.length;
        const targetSpeed = 30 + Math.random() * 10; // 30-40 km/h
        
        console.log(`🗺️ Generating route for ${driver.id}...`);
        
        // Add delay between requests to avoid rate limiting (150ms per driver)
        await new Promise(resolve => setTimeout(resolve, i * 150));
        
        try {
          const waypoints = await generateDriverRoute(startIndex);
          
          if (waypoints.length > 10) {
            // Use the Directions API waypoints directly - they're already road-snapped
            const snappedWaypoints = waypoints;
            
            // Find the closest waypoint to driver's starting position
            let closestIndex = 0;
            let minDistance = Infinity;
            
            for (let j = 0; j < snappedWaypoints.length; j++) {
              const dist = calculateDistance(
                driver.lat,
                driver.lng,
                snappedWaypoints[j].lat,
                snappedWaypoints[j].lng
              );
              if (dist < minDistance) {
                minDistance = dist;
                closestIndex = j;
              }
            }
            
            // Use the closest waypoint as starting position (already on road)
            const startingPosition = snappedWaypoints[closestIndex];
            
            routesRef.current.set(driver.id, {
              waypoints: snappedWaypoints,
              currentIndex: closestIndex,
              progress: 0,
              speed: targetSpeed,
              targetSpeed: targetSpeed,
              isLoading: false,
              lastUpdateTime: Date.now(),
            });
            
            console.log(`✅ Route loaded for ${driver.id}: ${snappedWaypoints.length} waypoints`);
          } else {
            console.error(`Failed to load route for ${driver.id}: insufficient waypoints`);
          }
        } catch (error) {
          console.error(`Error loading route for ${driver.id}:`, error);
        }
      }
      
      console.log(`✨ Routes loaded successfully: ${routesRef.current.size}/${initialDrivers.length} drivers`);
      
      // Update initial driver positions to match their route starting points
      setLiveDrivers(prevDrivers => 
        prevDrivers.map(driver => {
          const route = routesRef.current.get(driver.id);
          if (route && route.waypoints.length > 0) {
            const startPoint = route.waypoints[route.currentIndex];
            return {
              ...driver,
              lat: startPoint.lat,
              lng: startPoint.lng,
            };
          }
          return driver;
        })
      );
      
      setRoutesLoaded(true);
    }, 2000); // Wait 2 seconds for map to load

    return () => clearTimeout(initTimeout);
  }, []);

  // Movement loop
  useEffect(() => {
    if (!routesLoaded) {
      console.log('⏳ Waiting for routes to load...');
      return;
    }
    
    console.log('🚀 Starting movement simulation with', routesRef.current.size, 'routes');
    
    let updateCount = 0;
    
    const id = setInterval(() => {
      const now = Date.now();
      updateCount++;
      
      if (updateCount % 10 === 0) {
        console.log(`🔄 Movement update #${updateCount}`);
      }
      
      setLiveDrivers((prev) =>
        prev.map((d) => {
          // Update zone for offline drivers too (they still have a position)
          if (d.status === "offline") {
            const currentZone = getZoneFromCoordinates(d.lat, d.lng);
            return { ...d, zone: currentZone };
          }

          const route = routesRef.current.get(d.id);
          
          // STRICT VALIDATION: Only move if we have a valid road-based route
          // Minimum 10 waypoints ensures this is real road data, not a fallback
          if (!route || route.waypoints.length < 10 || route.isLoading) {
            // No route but update zone based on current position
            const currentZone = getZoneFromCoordinates(d.lat, d.lng);
            return { ...d, zone: currentZone };
          }

          if (d.status === "active") {
            // Calculate time since last update (in seconds)
            const timeDeltaSeconds = (now - route.lastUpdateTime) / 1000;
            
            // Add slight speed variation (traffic conditions, acceleration/deceleration)
            // Keep within realistic urban limits: 25-45 km/h
            const speedVariation = (Math.random() - 0.5) * 4; // ±2 km/h variation
            const currentTargetSpeed = Math.max(25, Math.min(45, route.targetSpeed + speedVariation));
            
            // Calculate next position with smooth interpolation
            const { newIndex, newProgress, position, actualSpeed } = calculateNextPosition(
              route.waypoints,
              route.currentIndex,
              route.progress,
              currentTargetSpeed,
              timeDeltaSeconds
            );
            
            // VALIDATION: Ensure position is valid (not NaN or undefined)
            if (!position || isNaN(position.lat) || isNaN(position.lng)) {
              console.error(`Invalid position for ${d.id}, keeping current position`);
              return d;
            }
            
            // VALIDATION: Ensure position is within reasonable bounds (Johannesburg area)
            // Johannesburg bounds: roughly -26.3 to -25.9 lat, 27.8 to 28.3 lng
            if (position.lat < -26.5 || position.lat > -25.5 || 
                position.lng < 27.5 || position.lng > 28.5) {
              console.error(`Position out of bounds for ${d.id}: ${position.lat}, ${position.lng}`);
              return d;
            }
            
            // ROAD ADHERENCE: Position is interpolated between road-snapped waypoints
            // from Google Directions API, so it's already on the road
            let finalPosition = position;
            
            // Update route state
            route.currentIndex = newIndex;
            route.progress = newProgress;
            route.speed = actualSpeed;
            route.lastUpdateTime = now;

            // Update zone based on current position
            const currentZone = getZoneFromCoordinates(finalPosition.lat, finalPosition.lng);
            
            // Debug log for first driver every 20 updates
            if (updateCount % 20 === 0 && d.id === 'D001') {
              console.log(`🏍️ ${d.id} @ ${currentZone} (${finalPosition.lat.toFixed(4)}, ${finalPosition.lng.toFixed(4)})`);
            }

            return {
              ...d,
              lat: finalPosition.lat,
              lng: finalPosition.lng,
              speed: Math.round(actualSpeed),
              zone: currentZone,
            };
          } else {
            // Idle - stay at exact current waypoint position (no interpolation)
            const currentWaypoint = route.waypoints[route.currentIndex];
            const currentZone = getZoneFromCoordinates(currentWaypoint.lat, currentWaypoint.lng);
            
            return {
              ...d,
              lat: currentWaypoint.lat,
              lng: currentWaypoint.lng,
              speed: 0,
              zone: currentZone,
            };
          }
        })
      );
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, routesLoaded]);

  return liveDrivers;
}

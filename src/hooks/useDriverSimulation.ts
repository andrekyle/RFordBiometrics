import { useState, useEffect, useRef } from "react";
import { drivers as initialDrivers, Driver } from "@/lib/mock-data";

// Round to 4 decimal places to avoid floating point issues
function roundCoord(value: number): number {
  return Math.round(value * 10000) / 10000;
}

// Generate more realistic directional movement
interface DriverMovement {
  direction: number; // angle in radians
  speed: number;
  changeDirectionCounter: number;
}

export function useDriverSimulation(intervalMs = 1500) {
  const [liveDrivers, setLiveDrivers] = useState<Driver[]>(initialDrivers);
  const movementStateRef = useRef<Map<string, DriverMovement>>(new Map());

  // Initialize movement state for each driver
  useEffect(() => {
    initialDrivers.forEach((driver) => {
      if (!movementStateRef.current.has(driver.id)) {
        movementStateRef.current.set(driver.id, {
          direction: Math.random() * Math.PI * 2,
          speed: driver.speed,
          changeDirectionCounter: 0,
        });
      }
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveDrivers(prev =>
        prev.map(d => {
          if (d.status === "offline") return d;
          
          const moving = d.status === "active";
          const movementState = movementStateRef.current.get(d.id);
          
          if (!movementState) return d;

          // Change direction periodically for more realistic movement
          movementState.changeDirectionCounter++;
          if (movementState.changeDirectionCounter > 5) {
            // Slight direction change (more natural turns)
            movementState.direction += (Math.random() - 0.5) * 0.5;
            movementState.changeDirectionCounter = 0;
          }

          if (moving) {
            // Calculate movement distance based on speed
            // Speed is in km/h, we need to convert to lat/lng delta
            // Rough approximation: 0.001 degree ≈ 111 meters
            const speedKmh = Math.max(15, Math.min(50, d.speed + (Math.random() - 0.5) * 10));
            const distancePerInterval = (speedKmh / 3600) * (intervalMs / 1000); // km
            const distanceDegrees = distancePerInterval / 111; // Convert to degrees

            // Move in the current direction
            const latDelta = Math.cos(movementState.direction) * distanceDegrees;
            const lngDelta = Math.sin(movementState.direction) * distanceDegrees;

            const newLat = roundCoord(d.lat + latDelta);
            const newLng = roundCoord(d.lng + lngDelta);
            
            // Keep drivers within Johannesburg bounds
            const boundedLat = Math.max(-26.3, Math.min(-25.9, newLat));
            const boundedLng = Math.max(27.9, Math.min(28.3, newLng));

            movementState.speed = speedKmh;
            movementStateRef.current.set(d.id, movementState);

            return {
              ...d,
              lat: boundedLat,
              lng: boundedLng,
              speed: Math.round(speedKmh),
            };
          } else {
            // Idle - minimal random movement
            const newLat = roundCoord(d.lat + (Math.random() - 0.5) * 0.0002);
            const newLng = roundCoord(d.lng + (Math.random() - 0.5) * 0.0002);
            
            return {
              ...d,
              lat: newLat,
              lng: newLng,
              speed: 0,
            };
          }
        })
      );
    }, intervalMs);
    
    return () => clearInterval(id);
  }, [intervalMs]);

  return liveDrivers;
}

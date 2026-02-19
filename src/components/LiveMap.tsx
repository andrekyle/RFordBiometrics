/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Driver } from "@/lib/mock-data";

const GOOGLE_MAPS_API_KEY = "AIzaSyA3YNzpG8zsCR5KwC_yRAsJzRIs8TaRdsA";

interface LiveMapProps {
  className?: string;
  height?: string;
  drivers: Driver[];
}

// Motorbike image icon component
function MotorbikeIcon({ rotation = 0, isActive = true }: { rotation?: number; isActive?: boolean }) {
  return (
    <img
      src="/motorbike.png"
      alt="Motorbike"
      style={{
        width: '16px',
        height: '16px',
        transform: `rotate(${rotation}deg)`,
        filter: isActive 
          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' 
          : 'grayscale(100%) opacity(0.5) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        transition: 'transform 0.3s ease-out',
      }}
      className="sm:w-5 sm:h-5"
    />
  );
}

// Calculate rotation angle based on movement direction
function calculateRotation(prevLat: number, prevLng: number, currLat: number, currLng: number): number {
  const dLat = currLat - prevLat;
  const dLng = currLng - prevLng;
  
  if (dLat === 0 && dLng === 0) return 0;
  
  // Calculate angle in degrees (0° = North, 90° = East)
  let angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return angle;
}

// Calculate angle difference (accounting for 360° wrap)
function getAngleDifference(angle1: number, angle2: number): number {
  let diff = angle2 - angle1;
  // Normalize to -180 to 180 range
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return Math.abs(diff);
}

function DriverMarker({ 
  driver, 
  prevPosition, 
  currentRotation 
}: { 
  driver: Driver; 
  prevPosition?: { lat: number; lng: number };
  currentRotation: number;
}) {
  const isActive = driver.status === "active";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AdvancedMarker position={{ lat: driver.lat, lng: driver.lng }}>
      <div 
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Motorbike icon */}
        <div className="relative">
          <MotorbikeIcon rotation={currentRotation} isActive={isActive} />
          
          {/* Active pulse indicator */}
          {isActive && (
            <div
              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-white sm:border-2"
              style={{
                animation: 'pulse 2s infinite',
              }}
            />
          )}
        </div>
        
        {/* Driver name label - always visible */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0.5 sm:mt-1 pointer-events-none">
          <div className="bg-white text-black text-[8px] sm:text-[10px] font-medium rounded px-1.5 py-0.5 sm:px-2 whitespace-nowrap shadow-lg border border-gray-200">
            {driver.name.split(' ')[0]}
          </div>
        </div>
        
        {/* Detailed info tooltip on hover - hidden on mobile */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none z-50 hidden sm:block">
            <div className="bg-black/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-700">
              <div className="font-semibold text-sm">{driver.name}</div>
              <div className="text-gray-300 mt-1">{driver.id}</div>
              <div className="text-gray-300">Speed: {driver.speed} km/h</div>
              <div className={`mt-1 text-xs font-medium ${
                driver.status === 'active' ? 'text-green-400' : 
                driver.status === 'idle' ? 'text-yellow-400' : 
                'text-gray-400'
              }`}>
                {driver.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}

export function LiveMap({ className, height = "400px", drivers }: LiveMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Track previous positions for rotation calculation
  // Using object instead of Map to avoid conflict with Google Maps API
  const prevPositionsRef = useRef<Record<string, { lat: number; lng: number }>>({});
  // Track current rotation angles for each driver
  const rotationsRef = useRef<Record<string, number>>({});
  
  // Minimum angle change (in degrees) to trigger rotation update
  const ROTATION_THRESHOLD = 15;

  // Update positions and rotations after render
  useEffect(() => {
    drivers.forEach((driver) => {
      const prevPos = prevPositionsRef.current[driver.id];
      const currentRotation = rotationsRef.current[driver.id] || 0;
      
      if (prevPos) {
        // Calculate new rotation based on movement
        const newRotation = calculateRotation(prevPos.lat, prevPos.lng, driver.lat, driver.lng);
        
        // Only update rotation if direction changed significantly
        if (newRotation !== 0) {
          const angleDiff = getAngleDifference(currentRotation, newRotation);
          if (angleDiff > ROTATION_THRESHOLD) {
            rotationsRef.current[driver.id] = newRotation;
          }
        }
      } else {
        // Initialize rotation for new drivers
        rotationsRef.current[driver.id] = 0;
      }
      
      // Update previous position
      prevPositionsRef.current[driver.id] = { lat: driver.lat, lng: driver.lng };
    });
  }, [drivers]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className={className} style={{ height, position: "relative" }}>
        <Map
          defaultCenter={{ lat: -26.1076, lng: 28.0567 }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="biosentinel-map"
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            // Uber-style map appearance
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#8a8a8a" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9e6f7" }],
            },
          ]}
          onCameraChanged={() => setMapLoaded(true)}
        >
          {mapLoaded && (
            <>
              {drivers.map((driver) => {
                const currentRotation = rotationsRef.current[driver.id] || 0;
                const prevPos = prevPositionsRef.current[driver.id];
                
                return (
                  <DriverMarker 
                    key={driver.id} 
                    driver={driver} 
                    prevPosition={prevPos}
                    currentRotation={currentRotation}
                  />
                );
              })}
            </>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

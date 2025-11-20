// app/components/map/PublicMatatuMap.tsx
// Frontend: Public map component with geofencing integration

'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Eye, EyeOff } from 'lucide-react';
import { STAGE_GEOFENCES, generateVehicleLocationInGeofence, isPointInGeofence } from '@/utils/geofencing';

interface Vehicle {
  id: string;
  registrationPlate: string;
  route: string;
  avgRating: number;
  ratingCount: number;
  safetyScore: number;
  sacco: {
    name: string;
  };
}

export default function PublicMatatuMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geofenceLayersRef = useRef<any[]>([]);
  const vehicleMarkersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [selectedGeofence, setSelectedGeofence] = useState<string | null>(null);

  // Fetch ALL vehicles (public endpoint) - no limit to get all vehicles
  useEffect(() => {
    // Fetch all vehicles by making multiple requests if needed
    const fetchAllVehicles = async () => {
      try {
        let allVehicles: Vehicle[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const res = await fetch(`/api/vehicles?limit=${limit}&offset=${offset}`);
          const data = await res.json();
          
          if (data.success && data.data.vehicles.length > 0) {
            allVehicles = [...allVehicles, ...data.data.vehicles];
            hasMore = data.data.hasMore;
            offset += limit;
          } else {
            hasMore = false;
          }
        }

        setVehicles(allVehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVehicles();
  }, []);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    if (typeof window !== 'undefined' && !mapLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setMapLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        if (document.head.contains(link)) document.head.removeChild(link);
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [mapLoaded]);

  // Initialize map and geofences
  useEffect(() => {
    if (mapLoaded && mapRef.current && typeof window !== 'undefined') {
      const L = (window as any).L;
      
      // Initialize map centered on Nairobi CBD
      const map = L.map(mapRef.current).setView([-1.2921, 36.8219], 12);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Draw geofences
      const geofenceLayers: any[] = [];
      STAGE_GEOFENCES.forEach((geofence) => {
        const circle = L.circle([geofence.center.lat, geofence.center.lng], {
          radius: geofence.radius,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5',
        });

        if (showGeofences) {
          circle.addTo(map);
        }

        circle.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${geofence.name}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Geofence Radius:</strong> ${geofence.radius}m</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">Click to view vehicles in this area</p>
          </div>
        `);

        circle.on('click', () => {
          setSelectedGeofence(geofence.id);
        });

        geofenceLayers.push(circle);
      });
      geofenceLayersRef.current = geofenceLayers;

      // Cleanup
      return () => {
        map.remove();
      };
    }
  }, [mapLoaded, showGeofences]);

  // Update vehicles on map with geofencing
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && vehicles.length > 0) {
      const L = (window as any).L;
      const map = mapInstanceRef.current;

      // Clear existing vehicle markers
      vehicleMarkersRef.current.forEach(marker => marker.remove());
      vehicleMarkersRef.current = [];

      // Group ALL vehicles by geofence (match by route) or assign to nearest geofence
      const geofenceVehicles: Record<string, Vehicle[]> = {};
      const unassignedVehicles: Vehicle[] = [];
      
      // First pass: Try to match vehicles to geofences by route
      vehicles.forEach((vehicle) => {
        let matched = false;
        const routeLower = vehicle.route.toLowerCase();
        
        for (const geofence of STAGE_GEOFENCES) {
          const geofenceNameLower = geofence.name.toLowerCase();
          const geofenceParts = geofenceNameLower.split(' - ');
          
          if (geofenceParts.some(part => routeLower.includes(part))) {
            if (!geofenceVehicles[geofence.id]) {
              geofenceVehicles[geofence.id] = [];
            }
            geofenceVehicles[geofence.id].push(vehicle);
            matched = true;
            break; // Assign to first matching geofence
          }
        }
        
        if (!matched) {
          unassignedVehicles.push(vehicle);
        }
      });

      // Second pass: Assign unassigned vehicles to nearest geofence or distribute evenly
      if (unassignedVehicles.length > 0) {
        // Distribute unassigned vehicles across geofences
        const geofencesArray = STAGE_GEOFENCES;
        unassignedVehicles.forEach((vehicle, index) => {
          const geofenceIndex = index % geofencesArray.length;
          const geofence = geofencesArray[geofenceIndex];
          
          if (!geofenceVehicles[geofence.id]) {
            geofenceVehicles[geofence.id] = [];
          }
          geofenceVehicles[geofence.id].push(vehicle);
        });
      }

      // Add ALL vehicle markers on the map
      Object.entries(geofenceVehicles).forEach(([geofenceId, stageVehicles]) => {
        const geofence = STAGE_GEOFENCES.find(g => g.id === geofenceId);
        if (!geofence) return;

        stageVehicles.forEach((vehicle, index) => {
          // Generate a location within the geofence
          const vehicleLocation = generateVehicleLocationInGeofence(geofence);
          
          // Verify it's within the geofence
          if (isPointInGeofence(vehicleLocation, geofence)) {
            const vehicleIcon = L.divIcon({
              className: 'vehicle-marker',
              html: `
                <div style="
                  background-color: ${vehicle.safetyScore >= 3 ? '#10b981' : '#ef4444'};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <span style="
                    color: white;
                    font-weight: bold;
                    font-size: 10px;
                  ">🚐</span>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const marker = L.marker([vehicleLocation.lat, vehicleLocation.lng], { icon: vehicleIcon })
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 200px;">
                  <h4 style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">${vehicle.registrationPlate}</h4>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Route:</strong> ${vehicle.route}</p>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Sacco:</strong> ${vehicle.sacco.name}</p>
                  <div style="display: flex; gap: 8px; margin-top: 6px;">
                    <span style="font-size: 11px;">⭐ ${vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : 'N/A'}</span>
                    <span style="font-size: 11px;">🛡️ ${vehicle.safetyScore > 0 ? vehicle.safetyScore.toFixed(1) : 'N/A'}</span>
                  </div>
                  <p style="margin-top: 6px; font-size: 11px; color: #666;">📍 Within ${geofence.name} geofence</p>
                </div>
              `);

            vehicleMarkersRef.current.push(marker);
          }
        });
      });

      // Add stage markers with geofence info showing ALL vehicles
      STAGE_GEOFENCES.forEach((geofence) => {
        const stageVehicles = geofenceVehicles[geofence.id] || [];
        const vehicleCount = stageVehicles.length;
        const hasReports = stageVehicles.some(v => v.safetyScore < 3);
        
        let markerColor = '#10b981'; // Green - Available
        if (hasReports) {
          markerColor = '#ef4444'; // Red - Has reports
        } else if (vehicleCount > 0) {
          markerColor = '#3b82f6'; // Blue - At stage
        }

        const icon = L.divIcon({
          className: 'stage-marker',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-weight: bold;
                font-size: 14px;
              ">${vehicleCount}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const marker = L.marker([geofence.center.lat, geofence.center.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 250px; max-width: 300px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${geofence.name}</h3>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Geofence:</strong> ${geofence.radius}m radius</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Total Vehicles:</strong> ${vehicleCount}</p>
              ${vehicleCount > 0 ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; max-height: 200px; overflow-y: auto;">
                  <p style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: bold;">All Vehicles in Geofence:</p>
                  ${stageVehicles.slice(0, 8).map((v) => `
                    <div style="margin: 6px 0; padding: 6px; background: #f5f5f5; border-radius: 4px;">
                      <p style="font-size: 13px; font-weight: bold; margin: 0;">${v.registrationPlate}</p>
                      <p style="font-size: 11px; color: #666; margin: 2px 0;">${v.route}</p>
                      <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <span style="font-size: 11px;">⭐ ${v.avgRating > 0 ? v.avgRating.toFixed(1) : 'N/A'}</span>
                        <span style="font-size: 11px;">🛡️ ${v.safetyScore > 0 ? v.safetyScore.toFixed(1) : 'N/A'}</span>
                        <span style="font-size: 11px;">${v.sacco.name}</span>
                      </div>
                    </div>
                  `).join('')}
                  ${vehicleCount > 8 ? `<p style="font-size: 11px; color: #999; margin-top: 4px;">+${vehicleCount - 8} more vehicles</p>` : ''}
                </div>
              ` : `
                <p style="font-size: 12px; color: #999; margin-top: 8px;">No vehicles in this geofence</p>
              `}
            </div>
          `);

        vehicleMarkersRef.current.push(marker);
      });
    }
  }, [mapLoaded, vehicles, selectedGeofence]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Geofence Controls */}
      <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Unified Map - All Vehicles</h3>
            <span className="text-sm text-gray-500">({vehicles.length} vehicles)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-300"></div>
            <span>Geofence Boundaries</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Vehicles</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Vehicles with Reports</span>
          </div>
        </div>
        <button
          onClick={() => setShowGeofences(!showGeofences)}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          {showGeofences ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Geofences
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Geofences
            </>
          )}
        </button>
      </div>

      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-lg border border-gray-200 shadow-md"
        style={{ zIndex: 0 }}
      />
      <style jsx global>{`
        .stage-marker,
        .vehicle-marker {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-interactive {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}


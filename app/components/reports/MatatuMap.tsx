// app/components/reports/MatatuMap.tsx
// Frontend: Map component showing matatu stages and reports

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

// Popular matatu stages in Nairobi (coordinates)
const NAIROBI_STAGES = [
  { name: 'CBD - Kencom', lat: -1.2921, lng: 36.8219, vehicles: 15 },
  { name: 'CBD - Railways', lat: -1.2833, lng: 36.8172, vehicles: 12 },
  { name: 'CBD - OTC', lat: -1.2864, lng: 36.8225, vehicles: 20 },
  { name: 'Westlands', lat: -1.2634, lng: 36.8025, vehicles: 8 },
  { name: 'Kangemi', lat: -1.2708, lng: 36.7500, vehicles: 10 },
  { name: 'Ngong Road', lat: -1.3000, lng: 36.7833, vehicles: 14 },
  { name: 'Thika Road', lat: -1.2500, lng: 36.8500, vehicles: 18 },
  { name: 'Eastleigh', lat: -1.2833, lng: 36.8500, vehicles: 12 },
  { name: 'Karen', lat: -1.3167, lng: 36.7000, vehicles: 6 },
  { name: 'Ruaraka', lat: -1.2333, lng: 36.8833, vehicles: 9 },
];

interface Report {
  id: string;
  vehicleId: string;
  category: string;
  vehicle: {
    registrationPlate: string;
    route: string;
  };
}

interface MatatuMapProps {
  reports: Report[];
}

export default function MatatuMap({ reports }: MatatuMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

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
        document.head.removeChild(link);
        document.body.removeChild(script);
      };
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && typeof window !== 'undefined') {
      const L = (window as any).L;
      
      // Initialize map centered on Nairobi CBD
      const map = L.map(mapRef.current).setView([-1.2921, 36.8219], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add stage markers
      NAIROBI_STAGES.forEach((stage) => {
        const stageReports = reports.filter(
          (r) => r.vehicle.route.includes(stage.name.split(' - ')[0]) ||
                 r.vehicle.route.includes(stage.name.split(' - ')[1])
        );

        const markerColor = stageReports.length > 0 ? 'red' : 'green';
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-weight: bold;
                font-size: 12px;
              ">${stage.vehicles}</div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const marker = L.marker([stage.lat, stage.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${stage.name}</h3>
              <p style="margin: 4px 0;"><strong>Vehicles:</strong> ${stage.vehicles}</p>
              <p style="margin: 4px 0;"><strong>Active Reports:</strong> ${stageReports.length}</p>
              ${stageReports.length > 0 ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">
                  <p style="font-size: 12px; color: #666; margin-bottom: 4px;">Recent Reports:</p>
                  ${stageReports.slice(0, 3).map((r) => `
                    <p style="font-size: 11px; margin: 2px 0;">
                      ${r.vehicle.registrationPlate} - ${r.category.replace(/_/g, ' ')}
                    </p>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `);

        marker.on('click', () => {
          setSelectedStage(stage.name);
        });
      });

      // Cleanup
      return () => {
        map.remove();
      };
    }
  }, [mapLoaded, reports]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Matatu Stages Map</h2>
          <p className="text-sm text-gray-600">
            View matatu stages across Nairobi. Red markers indicate stages with active reports.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Safe Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Reports Active</span>
          </div>
        </div>
      </div>
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-lg border border-gray-200 shadow-md"
        style={{ zIndex: 0 }}
      />
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}


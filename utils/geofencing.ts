// utils/geofencing.ts
// Geofencing utilities for stage boundaries

export interface Geofence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in meters
}

export interface Point {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  point1: Point,
  point2: Point
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a point is within a geofence
 */
export function isPointInGeofence(
  point: Point,
  geofence: Geofence
): boolean {
  const distance = calculateDistance(point, geofence.center);
  return distance <= geofence.radius;
}

/**
 * Get all geofences that contain a point
 */
export function getGeofencesForPoint(
  point: Point,
  geofences: Geofence[]
): Geofence[] {
  return geofences.filter(geofence => isPointInGeofence(point, geofence));
}

/**
 * Stage geofence definitions for Nairobi
 * Radius is in meters (typically 200-500m for matatu stages)
 */
export const STAGE_GEOFENCES: Geofence[] = [
  {
    id: 'cbd-kencom',
    name: 'CBD - Kencom',
    center: { lat: -1.2921, lng: 36.8219 },
    radius: 300, // 300 meters
  },
  {
    id: 'cbd-railways',
    name: 'CBD - Railways',
    center: { lat: -1.2833, lng: 36.8172 },
    radius: 250,
  },
  {
    id: 'cbd-otc',
    name: 'CBD - OTC',
    center: { lat: -1.2864, lng: 36.8225 },
    radius: 350,
  },
  {
    id: 'westlands',
    name: 'Westlands',
    center: { lat: -1.2634, lng: 36.8025 },
    radius: 400,
  },
  {
    id: 'kangemi',
    name: 'Kangemi',
    center: { lat: -1.2708, lng: 36.7500 },
    radius: 300,
  },
  {
    id: 'ngong-road',
    name: 'Ngong Road',
    center: { lat: -1.3000, lng: 36.7833 },
    radius: 350,
  },
  {
    id: 'thika-road',
    name: 'Thika Road',
    center: { lat: -1.2500, lng: 36.8500 },
    radius: 400,
  },
  {
    id: 'eastleigh',
    name: 'Eastleigh',
    center: { lat: -1.2833, lng: 36.8500 },
    radius: 300,
  },
  {
    id: 'karen',
    name: 'Karen',
    center: { lat: -1.3167, lng: 36.7000 },
    radius: 350,
  },
  {
    id: 'ruaraka',
    name: 'Ruaraka',
    center: { lat: -1.2333, lng: 36.8833 },
    radius: 300,
  },
];

/**
 * Generate a simulated vehicle location within a geofence
 * This is used when we don't have actual GPS coordinates
 */
export function generateVehicleLocationInGeofence(
  geofence: Geofence
): Point {
  // Generate a random point within the geofence circle
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * geofence.radius;
  
  // Convert distance to lat/lng offset (approximate)
  const latOffset = (distance / 111000) * Math.cos(angle);
  const lngOffset = (distance / (111000 * Math.cos(toRadians(geofence.center.lat)))) * Math.sin(angle);
  
  return {
    lat: geofence.center.lat + latOffset,
    lng: geofence.center.lng + lngOffset,
  };
}


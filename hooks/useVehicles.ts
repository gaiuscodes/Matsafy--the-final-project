// hooks/useVehicles.ts
// Custom hook for fetching vehicles

'use client';

import { useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  registrationPlate: string;
  route: string;
  capacity: number;
  avgRating: number;
  ratingCount: number;
  safetyScore: number;
  cleanlinessScore: number;
  reportCount: number;
  sacco: {
    id: string;
    name: string;
  };
  driver?: {
    id: string;
    name: string;
  };
}

interface UseVehiclesOptions {
  route?: string;
  sacco?: string;
  plate?: string;
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.plate) params.append('plate', options.plate);
      if (options.route) params.append('route', options.route);
      if (options.sacco) params.append('sacco', options.sacco);

      const response = await fetch(`/api/vehicles?${params}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setVehicles(data.data.vehicles);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch vehicles');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [options.route, options.sacco, options.plate]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles,
  };
}


// hooks/useReports.ts
// Custom hook for fetching reports

'use client';

import { useState, useEffect } from 'react';

export interface Report {
  id: string;
  vehicleId: string;
  category: string;
  description: string;
  photoUrl: string | null;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  vehicle: {
    id: string;
    registrationPlate: string;
    route: string;
    sacco: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
  } | null;
}

interface UseReportsOptions {
  status?: string;
  category?: string;
  vehicleId?: string;
}

export function useReports(options: UseReportsOptions = {}) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.category) params.append('category', options.category);
      if (options.vehicleId) params.append('vehicleId', options.vehicleId);

      const response = await fetch(`/api/reports?${params}`, {
        credentials: 'include', // Include cookies for session
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(data.error?.message || 'Failed to fetch reports');
      }

      if (data.success) {
        setReports(data.data.reports);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch reports');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [options.status, options.category, options.vehicleId]);

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
  };
}


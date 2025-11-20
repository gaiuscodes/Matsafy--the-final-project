// app/(dashboard)/vehicles/page.tsx
// Frontend: Vehicles listing page

'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [saccoFilter, setSaccoFilter] = useState('');

  const { vehicles, isLoading, error, refetch } = useVehicles({
    plate: searchTerm || undefined,
    route: routeFilter || undefined,
    sacco: saccoFilter || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const getGradeColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800 border-green-300';
    if (rating >= 4.0) return 'bg-green-50 text-green-700 border-green-200';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (rating >= 3.0) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rating >= 2.5) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getGrade = (rating: number, count: number) => {
    if (count < 5) return 'N/A';
    if (rating >= 4.5) return 'A+';
    if (rating >= 4.0) return 'A';
    if (rating >= 3.5) return 'B';
    if (rating >= 3.0) return 'C';
    if (rating >= 2.5) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Find a Vehicle</h1>
            <div className="flex gap-2">
              <Link 
                href="/reports"
                className="btn btn-secondary btn-md"
              >
                Reports
              </Link>
              <Link 
                href="/profile"
                className="btn btn-ghost btn-md"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by registration plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <input
                type="text"
                placeholder="Route..."
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <input
                type="text"
                placeholder="Sacco..."
                value={saccoFilter}
                onChange={(e) => setSaccoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-md gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No vehicles found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold">{vehicles.length}</span> vehicles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                  <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">
                          {vehicle.registrationPlate}
                        </h3>
                        <p className="text-blue-100 text-sm">{vehicle.sacco.name}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border-2 font-bold text-lg ${getGradeColor(vehicle.avgRating)}`}>
                        {getGrade(vehicle.avgRating, vehicle.ratingCount)}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="font-medium text-gray-900">{vehicle.route}</p>
                      </div>

                      {vehicle.driver && (
                        <div className="text-sm text-gray-600">
                          Driver: {vehicle.driver.name}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-gray-900">
                              {vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {vehicle.ratingCount} ratings
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <span className={vehicle.safetyScore >= 4 ? 'text-green-500' : 'text-orange-500'}>⚠</span>
                            <span className="font-semibold text-gray-900">
                              {vehicle.safetyScore > 0 ? vehicle.safetyScore.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Safety</p>
                        </div>
                      </div>

                      {vehicle.reportCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                          <span className="text-red-600 text-sm">
                            ⚠ {vehicle.reportCount} active {vehicle.reportCount === 1 ? 'report' : 'reports'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        Tap to view details and rate
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 MatSafy. Making matatu journeys safer in Kenya.</p>
          <p className="mt-2 text-sm text-gray-500">with love by Gaiuscodes</p>
        </div>
      </footer>
    </div>
  );
}
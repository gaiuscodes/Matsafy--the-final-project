// app/map/page.tsx
// Frontend: Public map page - no authentication required

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const PublicMatatuMap = dynamic(() => import('@/components/map/PublicMatatuMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  ),
});

export default function PublicMapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Matatu Stages Map</h1>
                <p className="text-sm text-gray-500">View matatus at stages across Nairobi</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/vehicles" className="btn btn-secondary btn-md">
                Browse Vehicles
              </Link>
              <Link href="/login" className="btn btn-primary btn-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Live Matatu Locations</h2>
              <p className="text-sm text-gray-600">
                Explore matatu stages and see which vehicles are available. No account needed to view!
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>At Stage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Reports</span>
              </div>
            </div>
          </div>
          <PublicMatatuMap />
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3">Why This Feature?</h3>
          <p className="text-gray-700 mb-4">
            Our public map allows anyone to see matatu locations at stages across Nairobi. 
            This transparency helps passengers make informed decisions and promotes accountability 
            in the matatu industry.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-semibold mb-1">Real-time Locations</h4>
              <p className="text-sm text-gray-600">See where matatus are currently located</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">No Login Required</h4>
              <p className="text-sm text-gray-600">Accessible to everyone, anytime</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-semibold mb-1">Safety Information</h4>
              <p className="text-sm text-gray-600">View safety ratings and reports</p>
            </div>
          </div>
        </div>
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


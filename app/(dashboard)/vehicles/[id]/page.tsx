// app/(dashboard)/vehicles/[id]/page.tsx
// Frontend: Vehicle detail page with ratings

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  AlertTriangle, 
  Shield, 
  Users, 
  MapPin, 
  Loader2,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface Vehicle {
  id: string;
  registrationPlate: string;
  route: string;
  capacity: number;
  avgRating: number;
  ratingCount: number;
  safetyScore: number;
  cleanlinessScore: number;
  photoUrl: string | null;
  sacco: {
    id: string;
    name: string;
  };
  driver: {
    id: string;
    name: string;
  } | null;
  conductor: {
    id: string;
    name: string;
  } | null;
  ratings: Array<{
    id: string;
    score: number;
    safetyScore: number;
    cleanlinessScore: number;
    comfortScore: number | null;
    punctualityScore: number | null;
    comments: string | null;
    isAnonymous: boolean;
    createdAt: string;
    user: {
      id: string;
      name: string;
    } | null;
  }>;
  _count: {
    ratings: number;
    reports: number;
  };
}

interface Rating {
  id: string;
  score: number;
  safetyScore: number;
  cleanlinessScore: number;
  comfortScore: number | null;
  punctualityScore: number | null;
  comments: string | null;
  isAnonymous: boolean;
  createdAt: string;
  user: {
    name: string;
  } | null;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchVehicleData();
    fetchRatings();
  }, [vehicleId]);

  const fetchVehicleData = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      const data = await response.json();

      if (data.success) {
        setVehicle(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch vehicle');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching vehicle:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/ratings`);
      const data = await response.json();

      if (data.success) {
        setRatings(data.data.ratings);
        setRatingDistribution(data.data.distribution || {});
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const getGradeColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800 border-green-300';
    if (rating >= 4.0) return 'bg-green-50 text-green-700 border-green-200';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (rating >= 3.0) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rating >= 2.5) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getGrade = (rating: number) => {
    if (rating >= 4.5) return 'A+';
    if (rating >= 4.0) return 'A';
    if (rating >= 3.5) return 'B';
    if (rating >= 3.0) return 'C';
    if (rating >= 2.5) return 'D';
    return 'F';
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.round(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The vehicle you are looking for does not exist.'}</p>
          <Link href="/vehicles" className="btn btn-primary btn-md">
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/vehicles" className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{vehicle.registrationPlate}</h1>
                <p className="text-sm text-gray-500">{vehicle.sacco.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/vehicles/${vehicleId}/report`} className="btn btn-secondary btn-md">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </Link>
              <Link href={`/vehicles/${vehicleId}/rate`} className="btn btn-primary btn-md">
                <Star className="w-4 h-4 mr-2" />
                Rate Vehicle
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Vehicle Overview */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{vehicle.registrationPlate}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.route}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full border-2 font-bold text-lg ${getGradeColor(vehicle.avgRating)}`}>
                  {vehicle.avgRating > 0 ? getGrade(vehicle.avgRating) : 'N/A'}
                </div>
              </div>

              {vehicle.photoUrl && (
                <div className="mb-4">
                  <img
                    src={vehicle.photoUrl}
                    alt={vehicle.registrationPlate}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Sacco</p>
                    <p className="font-semibold">{vehicle.sacco.name}</p>
                  </div>
                </div>

                {vehicle.driver && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-semibold">{vehicle.driver.name}</p>
                    </div>
                  </div>
                )}

                {vehicle.conductor && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Conductor</p>
                      <p className="font-semibold">{vehicle.conductor.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-semibold">{vehicle.capacity} passengers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Ratings Summary */}
            <div>
              <h3 className="text-xl font-bold mb-4">Rating Summary</h3>
              
              <div className="space-y-4">
                {/* Overall Rating */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(vehicle.avgRating)}
                  </div>
                  <p className="text-xs text-gray-600">
                    Based on {vehicle.ratingCount} {vehicle.ratingCount === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>

                {/* Safety Score */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Safety Score
                    </span>
                    <span className="text-xl font-bold text-green-700">
                      {vehicle.safetyScore > 0 ? vehicle.safetyScore.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(vehicle.safetyScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Cleanliness Score */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cleanliness Score</span>
                    <span className="text-xl font-bold text-purple-700">
                      {vehicle.cleanlinessScore > 0 ? vehicle.cleanlinessScore.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(vehicle.cleanlinessScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rating Distribution */}
                {Object.keys(ratingDistribution).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</p>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0;
                        const percentage = vehicle.ratingCount > 0 
                          ? (count / vehicle.ratingCount) * 100 
                          : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-8">{star}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Recent Ratings ({vehicle._count.ratings})
            </h3>
            <Link 
              href={`/vehicles/${vehicleId}/rate`}
              className="btn btn-primary btn-md"
            >
              <Star className="w-4 h-4 mr-2" />
              Add Rating
            </Link>
          </div>

          {ratings.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No ratings yet</p>
              <p className="text-gray-400 text-sm mb-6">Be the first to rate this vehicle!</p>
              <Link href={`/vehicles/${vehicleId}/rate`} className="btn btn-primary btn-md">
                Rate This Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(rating.score)}
                      </div>
                      <span className="text-lg font-bold">{rating.score.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {rating.isAnonymous ? 'Anonymous' : rating.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Safety</p>
                      <p className="font-semibold">{rating.safetyScore.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cleanliness</p>
                      <p className="font-semibold">{rating.cleanlinessScore.toFixed(1)}</p>
                    </div>
                    {rating.comfortScore && (
                      <div>
                        <p className="text-xs text-gray-500">Comfort</p>
                        <p className="font-semibold">{rating.comfortScore.toFixed(1)}</p>
                      </div>
                    )}
                    {rating.punctualityScore && (
                      <div>
                        <p className="text-xs text-gray-500">Punctuality</p>
                        <p className="font-semibold">{rating.punctualityScore.toFixed(1)}</p>
                      </div>
                    )}
                  </div>

                  {rating.comments && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-gray-700">{rating.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports Section */}
        {vehicle._count.reports > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-red-900">
                    {vehicle._count.reports} Active {vehicle._count.reports === 1 ? 'Report' : 'Reports'}
                  </h3>
                  <p className="text-sm text-red-700">
                    This vehicle has pending safety reports
                  </p>
                </div>
              </div>
              <Link
                href={`/vehicles/${vehicleId}/reports`}
                className="btn btn-secondary btn-md"
              >
                View Reports
              </Link>
            </div>
          </div>
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


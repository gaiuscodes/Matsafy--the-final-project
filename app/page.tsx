// app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { HeroVideo } from '@/components/HeroVideo';
import { Star, AlertTriangle, Users, FileText, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/matlog.jpg"
              alt="MatSafy logo"
              width={40}
              height={40}
              className="rounded-xl shadow-md"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-500">MatSafy</p>
              <h1 className="text-2xl font-bold text-gray-900">Matatu Safety Network</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/reports"
              className="btn btn-ghost btn-md hidden md:inline-flex"
            >
              View Reports
            </Link>
            <Link 
              href="/vehicles"
              className="btn btn-ghost btn-md hidden md:inline-flex"
            >
              Vehicles
            </Link>
            <Link 
              href="/login"
              className="btn btn-ghost btn-md"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="btn btn-primary btn-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-emerald-900">
        <div className="absolute inset-0 flex justify-start">
          <div className="relative w-[45%] md:w-[40%] h-full overflow-hidden">
            <HeroVideo
              src="/brand/matsafylogo.mp4"
              poster="/brand/matlog.jpg"
              className="absolute inset-y-0 left-0 w-full h-[560px] md:h-[700px] object-cover brightness-[1.05]"
              playbackRate={0.6}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-transparent" />
          </div>
          <div className="hidden lg:block flex-1 bg-gradient-to-r from-blue-900/50 via-blue-900/30 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl ml-auto text-center lg:text-left text-white space-y-8">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Matatu Safety Network</p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Safe Matatu Journeys<br className="hidden md:block" /> Start Here
            </h2>
            <p className="text-lg md:text-xl text-blue-50">
              Monitor road safety, rate your journeys, and report misconduct on matatus. 
              Together, we can make public transport safer for everyone.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/register"
                className="btn btn-primary btn-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/vehicles"
                className="btn btn-secondary btn-lg bg-white/90 text-blue-700 hover:bg-white"
              >
                View Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-transparent hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-blue-600 group-hover:scale-110">
              <Star className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Rate Journeys</h4>
            <p className="text-gray-600">
              Rate your matatu journey on safety, cleanliness, and comfort. 
              Your ratings help others make informed choices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-transparent hover:bg-gradient-to-br hover:from-orange-50 hover:to-white group">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-orange-500 group-hover:scale-110">
              <AlertTriangle className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Report Incidents</h4>
            <p className="text-gray-600">
              Encountered reckless driving or harassment? Submit a report 
              with photos to help authorities take action.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-transparent hover:bg-gradient-to-br hover:from-green-50 hover:to-white group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-green-500 group-hover:scale-110">
              <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Community Safety</h4>
            <p className="text-gray-600">
              View real-time safety scores for vehicles and routes. 
              Make safer choices based on community feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:bg-white/30 hover:shadow-xl">
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Registered Vehicles</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:bg-white/30 hover:shadow-xl">
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-blue-100">Journey Ratings</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:bg-white/30 hover:shadow-xl">
              <div className="text-4xl font-bold mb-2">450+</div>
              <div className="text-blue-100">Reports Filed</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:bg-white/30 hover:shadow-xl">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">What Our Community Says</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "MatSafy has transformed how we travel. The transparency it brings means drivers know they're being watched, which increases accountability. I feel much safer knowing the community is actively policing the roads together."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Tim Gaius</p>
                <p className="text-sm text-gray-500">Ruaka</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The accountability this app creates is incredible. When everyone can rate and report, it creates real transparency. Drivers and conductors are more careful because they know passengers are watching. It's like having a community safety network."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Dave Zebedi</p>
                <p className="text-sm text-gray-500">Utawala</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Safety has improved so much since MatSafy. The transparency means we all police the roads together - drivers, passengers, everyone. It's created real accountability and made matatu travel safer for everyone in Karen and beyond."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Eva</p>
                <p className="text-sm text-gray-500">Karen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Reports Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">View Safety Reports</h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Stay informed about safety incidents across Nairobi. View community reports, 
                track verified incidents, and see which matatu stages need attention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold">Community Reports</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse all safety reports submitted by passengers. Filter by status, category, 
                  or vehicle to find specific incidents.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Real-time incident tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Photo evidence included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Anonymous reporting option
                  </li>
                </ul>
                <Link 
                  href="/reports"
                  className="inline-block btn btn-primary btn-md w-full text-center"
                >
                  View All Reports
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold">Stage Map</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Explore matatu stages across Nairobi on an interactive map. See which stages 
                  have active reports and track safety trends by location. <strong>No account needed!</strong>
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Interactive map view
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Stage location markers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Public access - no login required
                  </li>
                </ul>
                <Link 
                  href="/map"
                  className="inline-block btn btn-secondary btn-md w-full text-center"
                >
                  View Map
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Quick Access</h4>
                  <p className="text-gray-600">
                    Logged in users can view detailed reports, submit new incidents, and track safety metrics.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link 
                    href="/reports"
                    className="btn btn-primary btn-md"
                  >
                    View Reports
                  </Link>
                  <Link 
                    href="/vehicles"
                    className="btn btn-secondary btn-md"
                  >
                    Browse Vehicles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h3>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of passengers making matatu travel safer every day.
        </p>
        <Link 
          href="/register"
          className="inline-block btn btn-primary btn-lg"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 MatSafy. Making matatu journeys safer in Kenya.</p>
          <p className="mt-2 text-sm text-gray-500">with love by Gaiuscodes</p>
        </div>
      </footer>
    </div>
  );
}
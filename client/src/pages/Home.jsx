import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldCheck, BarChart3, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight">CivicResolve</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Empowering Citizens.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Improving Cities.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto mb-10">
              Report public issues, track resolution progress in real-time, and help us build a cleaner, safer, and more efficient community together.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/complaints/new">
                <Button size="lg" className="shadow-lg shadow-indigo-200 dark:shadow-none">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Track Status
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-2xl">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Location-Based</h3>
                <p className="text-gray-600 dark:text-gray-400">Pinpoint issues exactly where they are using our interactive map interface.</p>
              </div>
              <div className="glass p-8 rounded-2xl">
                <BarChart3 className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">Receive instant updates as your complaint moves through different departments.</p>
              </div>
              <div className="glass p-8 rounded-2xl">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Transparent Resolution</h3>
                <p className="text-gray-600 dark:text-gray-400">See response times, department accountability, and community statistics.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Info, Heart, Users, Shield, Clock, Sparkles } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive patient record management with detailed profiles and history tracking.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Heart,
      title: 'Appointment Scheduling',
      description: 'Efficient appointment booking system with dentist and service selection.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Industry-standard security practices to protect sensitive patient information.',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay up-to-date with instant notifications and status updates.',
      gradient: 'from-emerald-600 to-green-600'
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-6 shadow-2xl animate-pulse-glow">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            About Dental Clinic
            <Sparkles className="w-8 h-8 text-emerald-500" />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive solution for managing dental clinic operations, patient records, and appointments.
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-8 mb-8 border border-emerald-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">System Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Dental Clinic Management System is designed to streamline the daily operations of dental clinics.
                It provides a centralized platform for managing patient information, scheduling appointments, tracking
                treatments, processing payments, and generating comprehensive reports.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Built with modern web technologies including React and Tailwind CSS, the system offers a user-friendly
                interface that makes it easy for clinic staff to perform their tasks efficiently.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl mb-6 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">System Modules</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
              <span><strong>Dashboard:</strong> Overview of clinic statistics and recent activities</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
              <span><strong>Patient Management:</strong> Complete patient records and contact information</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
              <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-sm"></div>
              <span><strong>Dentist Profiles:</strong> Manage dentist information and specializations</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-sm"></div>
              <span><strong>Appointments:</strong> Schedule and track patient appointments</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
              <div className="w-3 h-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full shadow-sm"></div>
              <span><strong>Services & Pricing:</strong> Dental services catalog with pricing</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
              <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-full shadow-sm"></div>
              <span><strong>Payment Processing:</strong> Track and manage patient payments</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
              <span><strong>Report Generator:</strong> Generate comprehensive clinic reports</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
          <p className="mb-2">Version 1.0.0</p>
          <p>© 2026 Dental Clinic Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

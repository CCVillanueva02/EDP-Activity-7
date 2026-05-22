import { Users, UserCog, Calendar, DollarSign, TrendingUp, Activity, FileText, Stethoscope, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockPatients, mockDentists, mockAppointments, mockPayments } from '../data/mockData';

export function Dashboard() {
  const navigate = useNavigate();
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAppointments = mockAppointments.filter(a => a.appointment_status === 'Completed').length;
  const scheduledAppointments = mockAppointments.filter(a => a.appointment_status === 'Scheduled').length;

  const stats = [
    { label: 'Total Patients', value: mockPatients.length, icon: Users, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { label: 'Active Dentists', value: mockDentists.length, icon: UserCog, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { label: 'Appointments', value: mockAppointments.length, icon: Calendar, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50' },
    { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-600 to-green-600', bg: 'bg-emerald-50' },
  ];

  const recentAppointments = mockAppointments
    .slice(0, 5)
    .map(appt => {
      const patient = mockPatients.find(p => p.patient_id === appt.patient_id);
      const dentist = mockDentists.find(d => d.dentist_id === appt.dentist_id);
      return { ...appt, patient, dentist };
    });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Dashboard</h1>
        </div>
        <p className="text-gray-600 ml-13">Welcome to your Dental Clinic Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-4 text-gray-800">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => navigate('/patients')}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Manage</p>
            <p className="text-xl font-semibold text-gray-800">Patient Records</p>
            <p className="text-sm text-gray-500 mt-2">Add, edit, and view patient information</p>
          </button>

          <button
            onClick={() => navigate('/appointments')}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Schedule</p>
            <p className="text-xl font-semibold text-gray-800">Appointments</p>
            <p className="text-sm text-gray-500 mt-2">Book and manage appointments</p>
          </button>

          <button
            onClick={() => navigate('/treatments')}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Track</p>
            <p className="text-xl font-semibold text-gray-800">Treatment Records</p>
            <p className="text-sm text-gray-500 mt-2">Record treatments and billing</p>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-orange-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Generate</p>
            <p className="text-xl font-semibold text-gray-800">Reports</p>
            <p className="text-sm text-gray-500 mt-2">Export data to Excel reports</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl">Recent Appointments</h2>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((appt) => (
              <div key={appt.appointment_id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200">
                <div>
                  <p className="font-medium text-gray-800">{appt.patient?.fname} {appt.patient?.lname}</p>
                  <p className="text-sm text-gray-600">{appt.dentist?.fname} {appt.dentist?.lname}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">{appt.appointment_date}</p>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                    appt.appointment_status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                    appt.appointment_status === 'Scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {appt.appointment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl">Appointment Status</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Completed</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{completedAppointments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(completedAppointments / mockAppointments.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Scheduled</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{scheduledAppointments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(scheduledAppointments / mockAppointments.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Success Rate</span>
                <span className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {((completedAppointments / mockAppointments.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

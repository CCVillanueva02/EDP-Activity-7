import { useState } from 'react';
import { Plus, Search, CreditCard } from 'lucide-react';
import { mockPayments, mockAppointments, mockPatients } from '../data/mockData';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appointment_id: '',
    amount: '',
    payment_date: '',
  });

  const paymentsWithDetails = mockPayments.map(payment => {
    const appointment = mockAppointments.find(a => a.appointment_id === payment.appointment_id);
    const patient = appointment ? mockPatients.find(p => p.patient_id === appointment.patient_id) : null;
    return { ...payment, appointment, patient };
  });

  const filteredPayments = paymentsWithDetails.filter(payment =>
    `${payment.patient?.fname} ${payment.patient?.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setFormData({ appointment_id: '', amount: '', payment_date: '' });
  };

  const totalPayments = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Payments</h1>
          </div>
          <p className="text-gray-600 ml-13">Track and manage payments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-8 mb-6 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-700 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">₱{totalPayments.toLocaleString()}</p>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payments by patient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Payment ID</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Appointment ID</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Patient</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{payment.payment_id}</td>
                  <td className="px-6 py-4">{payment.appointment_id}</td>
                  <td className="px-6 py-4">{payment.patient?.fname} {payment.patient?.lname}</td>
                  <td className="px-6 py-4">₱{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{payment.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-emerald-100 transform transition-all">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h2 className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Record Payment</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Appointment</label>
                <select
                  value={formData.appointment_id}
                  onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Appointment</option>
                  {mockAppointments.map(appt => {
                    const patient = mockPatients.find(p => p.patient_id === appt.patient_id);
                    return (
                      <option key={appt.appointment_id} value={appt.appointment_id}>
                        Appt #{appt.appointment_id} - {patient?.fname} {patient?.lname} ({appt.appointment_date})
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Amount (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Payment Date</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-colors"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Stethoscope, CheckCircle, Loader, AlertCircle, RefreshCw, DollarSign } from 'lucide-react';
import ApiService from '../services/ApiService';

interface Treatment {
  treatment_id: number;
  patient_id: number | null;
  patient_name: string;
  dentist_id: number | null;
  dentist_name: string;
  treatment_date: string;
  treatment_type: string;
  description: string | null;
  cost: number;
  payment_status: 'Pending' | 'Partial' | 'Paid';
  notes: string | null;
  created_at?: string;
}

export function TreatmentRecords() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState<{ id: number; patient: string } | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    patient_name: '',
    dentist_name: '',
    treatment_date: '',
    treatment_type: 'Filling',
    description: '',
    cost: '',
    payment_status: 'Pending' as 'Pending' | 'Partial' | 'Paid',
    notes: ''
  });

  useEffect(() => {
    fetchTreatments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTreatments(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTreatments = async (search?: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.getTreatments(search);

      if (response.success) {
        setTreatments(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch treatments');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
      setTreatments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let response;

      if (editingTreatment) {
        response = await ApiService.updateTreatment(editingTreatment.treatment_id, formData);
      } else {
        response = await ApiService.createTreatment(formData);
      }

      if (response.success) {
        setSuccess(editingTreatment ? 'Treatment updated successfully!' : 'Treatment recorded successfully!');
        setShowModal(false);
        setEditingTreatment(null);
        setFormData({
          patient_name: '',
          dentist_name: '',
          treatment_date: '',
          treatment_type: 'Filling',
          description: '',
          cost: '',
          payment_status: 'Pending',
          notes: ''
        });
        fetchTreatments(searchTerm);
      } else {
        setError(response.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      patient_name: treatment.patient_name,
      dentist_name: treatment.dentist_name,
      treatment_date: treatment.treatment_date,
      treatment_type: treatment.treatment_type,
      description: treatment.description || '',
      cost: treatment.cost.toString(),
      payment_status: treatment.payment_status,
      notes: treatment.notes || ''
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteClick = (treatmentId: number, patientName: string) => {
    setTreatmentToDelete({ id: treatmentId, patient: patientName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!treatmentToDelete) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await ApiService.deleteTreatment(treatmentToDelete.id);

      if (response.success) {
        setSuccess('Treatment record deleted successfully!');
        setShowDeleteModal(false);
        setTreatmentToDelete(null);
        fetchTreatments(searchTerm);
      } else {
        setError(response.message || 'Failed to delete treatment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTreatmentToDelete(null);
  };

  const handleAddNew = () => {
    setEditingTreatment(null);
    setFormData({
      patient_name: '',
      dentist_name: '',
      treatment_date: '',
      treatment_type: 'Filling',
      description: '',
      cost: '',
      payment_status: 'Pending',
      notes: ''
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-8 dental-pattern-overlay min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Treatment Records</h1>
          </div>
          <p className="text-gray-600 ml-13">Manage patient treatment history and billing</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchTreatments(searchTerm)}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Treatment
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800">×</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search treatments by patient, dentist, or treatment type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading treatments...</span>
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No treatment records found</p>
              {searchTerm && <p className="text-sm mt-2">Try adjusting your search</p>}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Patient</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Dentist</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Treatment</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Cost</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Payment</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {treatments.map((treatment) => (
                  <tr key={treatment.treatment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{treatment.treatment_id}</td>
                    <td className="px-6 py-4 font-medium">{treatment.patient_name}</td>
                    <td className="px-6 py-4">{treatment.dentist_name}</td>
                    <td className="px-6 py-4">{treatment.treatment_date}</td>
                    <td className="px-6 py-4">{treatment.treatment_type}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(treatment.cost)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full border ${getPaymentStatusColor(treatment.payment_status)}`}>
                        {treatment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(treatment)}
                          disabled={loading}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                          title="Edit treatment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(treatment.treatment_id, treatment.patient_name)}
                          disabled={loading}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete treatment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total: <strong>{treatments.length}</strong> treatment record{treatments.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm font-semibold text-emerald-600">
              Total Revenue: {formatCurrency(treatments.reduce((sum, t) => sum + t.cost, 0))}
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-red-100 transform transition-all">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900">Delete Treatment Record</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the treatment record for{' '}
                <strong className="text-gray-900">"{treatmentToDelete?.patient}"</strong>?
              </p>
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                ⚠️ This treatment record and billing information will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-100 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 sticky top-0">
              <h2 className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {editingTreatment ? 'Update Treatment Record' : 'Add New Treatment'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Dentist Name *</label>
                  <input
                    type="text"
                    value={formData.dentist_name}
                    onChange={(e) => setFormData({ ...formData, dentist_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Treatment Date *</label>
                  <input
                    type="date"
                    value={formData.treatment_date}
                    onChange={(e) => setFormData({ ...formData, treatment_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Treatment Type *</label>
                  <select
                    value={formData.treatment_type}
                    onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                  >
                    <option value="Filling">Filling</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Extraction">Extraction</option>
                    <option value="Teeth Cleaning">Teeth Cleaning</option>
                    <option value="Whitening">Whitening</option>
                    <option value="Crown">Crown</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Implant">Implant</option>
                    <option value="Orthodontics">Orthodontics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                  disabled={loading}
                  placeholder="Treatment details and procedures performed..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Payment Status *</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                  disabled={loading}
                  placeholder="Additional notes or follow-up instructions..."
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-4 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {editingTreatment ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingTreatment ? 'Update Treatment' : 'Add Treatment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

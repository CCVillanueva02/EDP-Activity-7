import { useState, useEffect } from 'react';
import { FileText, Download, Loader, AlertCircle, BarChart3, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import ApiService from '../services/ApiService';

type ReportType = 'patients' | 'appointments' | 'treatments';

export function Reports() {
  const [reportType, setReportType] = useState<ReportType>('patients');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      switch (reportType) {
        case 'patients':
          response = await ApiService.getPatients();
          break;
        case 'appointments':
          response = await ApiService.getAppointments();
          break;
        case 'treatments':
          response = await ApiService.getTreatments();
          break;
      }

      if (response.success) {
        setData(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: any[], type: ReportType) => {
    switch (type) {
      case 'patients': {
        // Gender distribution
        const genderCounts = data.reduce((acc: any, patient) => {
          const gender = patient.gender || 'Not Specified';
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(genderCounts).map(([gender, count]) => ({
          Category: gender,
          Count: count
        }));
      }
      case 'appointments': {
        // Status distribution
        const statusCounts = data.reduce((acc: any, appt) => {
          acc[appt.status] = (acc[appt.status] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(statusCounts).map(([status, count]) => ({
          Category: status,
          Count: count
        }));
      }
      case 'treatments': {
        // Payment status distribution
        const paymentCounts = data.reduce((acc: any, treatment) => {
          acc[treatment.payment_status] = (acc[treatment.payment_status] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(paymentCounts).map(([status, count]) => ({
          Category: status,
          Count: count
        }));
      }
      default:
        return [];
    }
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      setError('No data to export');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare report title
      const reportTitles = {
        patients: 'Patient Records Report',
        appointments: 'Appointments Report',
        treatments: 'Treatment Records Report'
      };

      const reportTitle = reportTitles[reportType];
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Sheet 1: Report Data
      const sheetData: any[][] = [
        ['SMILE DENTAL CLINIC'],
        ['Comprehensive Dental Care & Services'],
        [],
        [reportTitle],
        [`Generated on: ${currentDate}`],
        [],
      ];

      // Add headers and data based on report type
      if (reportType === 'patients') {
        sheetData.push(['ID', 'First Name', 'Last Name', 'Phone', 'Email', 'Date of Birth', 'Gender', 'Address']);
        data.forEach(patient => {
          sheetData.push([
            patient.patient_id,
            patient.first_name,
            patient.last_name,
            patient.phone,
            patient.email || 'N/A',
            patient.date_of_birth || 'N/A',
            patient.gender || 'N/A',
            patient.address || 'N/A'
          ]);
        });
      } else if (reportType === 'appointments') {
        sheetData.push(['ID', 'Patient', 'Dentist', 'Date', 'Time', 'Service Type', 'Status', 'Notes']);
        data.forEach(appt => {
          sheetData.push([
            appt.appointment_id,
            appt.patient_name,
            appt.dentist_name,
            appt.appointment_date,
            appt.appointment_time,
            appt.service_type,
            appt.status,
            appt.notes || 'N/A'
          ]);
        });
      } else if (reportType === 'treatments') {
        sheetData.push(['ID', 'Patient', 'Dentist', 'Date', 'Treatment Type', 'Cost', 'Payment Status', 'Description']);
        data.forEach(treatment => {
          sheetData.push([
            treatment.treatment_id,
            treatment.patient_name,
            treatment.dentist_name,
            treatment.treatment_date,
            treatment.treatment_type,
            treatment.cost,
            treatment.payment_status,
            treatment.description || 'N/A'
          ]);
        });

        // Add total revenue for treatments
        const totalRevenue = data.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
        sheetData.push([]);
        sheetData.push(['', '', '', '', 'Total Revenue:', totalRevenue.toFixed(2), '', '']);
      }

      // Add signature section
      sheetData.push([]);
      sheetData.push([]);
      sheetData.push(['Prepared By: _____________________________']);
      sheetData.push(['Name: _____________________________']);
      sheetData.push(['Signature: _____________________________']);
      sheetData.push(['Date: _____________________________']);

      const ws_data = XLSX.utils.aoa_to_sheet(sheetData);

      // Style the header
      const range = XLSX.utils.decode_range(ws_data['!ref'] || 'A1');

      // Set column widths
      ws_data['!cols'] = [
        { wch: 8 },  // ID
        { wch: 15 }, // Name/Patient
        { wch: 15 }, // Last Name/Dentist
        { wch: 15 }, // Phone/Date
        { wch: 25 }, // Email/Time
        { wch: 15 }, // DOB/Service
        { wch: 12 }, // Gender/Status
        { wch: 30 }  // Address/Notes
      ];

      // Merge cells for title
      ws_data['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Company name
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Tagline
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }, // Report title
        { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } }  // Date
      ];

      XLSX.utils.book_append_sheet(wb, ws_data, 'Report Data');

      // Sheet 2: Chart Data
      const chartData = processChartData(data, reportType);

      const chartSheetData: any[][] = [
        ['SMILE DENTAL CLINIC - Data Analysis'],
        [],
        ['Distribution Chart Data'],
        []
      ];

      if (reportType === 'patients') {
        chartSheetData.push(['Gender Distribution']);
      } else if (reportType === 'appointments') {
        chartSheetData.push(['Appointment Status Distribution']);
      } else if (reportType === 'treatments') {
        chartSheetData.push(['Payment Status Distribution']);
      }

      chartSheetData.push([]);
      chartSheetData.push(['Category', 'Count', 'Percentage']);

      const total = chartData.reduce((sum, item) => sum + (item.Count || 0), 0);

      chartData.forEach(item => {
        const percentage = total > 0 ? ((item.Count / total) * 100).toFixed(2) : '0.00';
        chartSheetData.push([item.Category, item.Count, `${percentage}%`]);
      });

      chartSheetData.push([]);
      chartSheetData.push(['Total Records:', total, '100%']);

      const ws_chart = XLSX.utils.aoa_to_sheet(chartSheetData);

      // Set column widths for chart sheet
      ws_chart['!cols'] = [
        { wch: 20 }, // Category
        { wch: 10 }, // Count
        { wch: 12 }  // Percentage
      ];

      // Merge cells for chart sheet title
      ws_chart['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }
      ];

      XLSX.utils.book_append_sheet(wb, ws_chart, 'Chart Data');

      // Export file
      const fileName = `${reportTitle.replace(/ /g, '_')}_${Date.now()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setSuccess(`Report exported successfully: ${fileName}`);
    } catch (err: any) {
      setError(`Failed to export report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'patients': return 'Patient Records';
      case 'appointments': return 'Appointments';
      case 'treatments': return 'Treatment Records';
    }
  };

  const renderTable = () => {
    if (reportType === 'patients') {
      return (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">DOB</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Gender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((patient: any) => (
              <tr key={patient.patient_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{patient.patient_id}</td>
                <td className="px-6 py-4 font-medium">{patient.first_name} {patient.last_name}</td>
                <td className="px-6 py-4">{patient.phone}</td>
                <td className="px-6 py-4">{patient.email || 'N/A'}</td>
                <td className="px-6 py-4">{patient.date_of_birth || 'N/A'}</td>
                <td className="px-6 py-4">{patient.gender || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (reportType === 'appointments') {
      return (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Patient</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Dentist</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Service</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((appt: any) => (
              <tr key={appt.appointment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{appt.appointment_id}</td>
                <td className="px-6 py-4 font-medium">{appt.patient_name}</td>
                <td className="px-6 py-4">{appt.dentist_name}</td>
                <td className="px-6 py-4">{appt.appointment_date}</td>
                <td className="px-6 py-4">{appt.appointment_time}</td>
                <td className="px-6 py-4">{appt.service_type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (reportType === 'treatments') {
      return (
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((treatment: any) => (
              <tr key={treatment.treatment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{treatment.treatment_id}</td>
                <td className="px-6 py-4 font-medium">{treatment.patient_name}</td>
                <td className="px-6 py-4">{treatment.dentist_name}</td>
                <td className="px-6 py-4">{treatment.treatment_date}</td>
                <td className="px-6 py-4">{treatment.treatment_type}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600">
                  ${parseFloat(treatment.cost).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    treatment.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                    treatment.payment_status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {treatment.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="p-8 dental-pattern-overlay min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Reports</h1>
          </div>
          <p className="text-gray-600 ml-13">Generate and export system reports</p>
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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <label className="text-sm font-medium text-gray-700">Select Report Type:</label>
            </div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="patients">Patient Records</option>
              <option value="appointments">Appointments</option>
              <option value="treatments">Treatment Records</option>
            </select>
          </div>

          <button
            onClick={exportToExcel}
            disabled={loading || data.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export to Excel
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="text-2xl font-semibold text-gray-900">{getReportTitle()} Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading report data...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-2">Add some records to generate reports</p>
            </div>
          ) : (
            renderTable()
          )}
        </div>

        {data.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total Records: <strong>{data.length}</strong>
              </p>
              {reportType === 'treatments' && (
                <p className="text-sm font-semibold text-emerald-600">
                  Total Revenue: ${data.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Excel Report Contents:</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-4">
          <li>• <strong>Sheet 1:</strong> Complete report with clinic header, data table, and signature section</li>
          <li>• <strong>Sheet 2:</strong> Chart data with distribution analysis and percentages</li>
          <li>• Formatted columns with proper widths for easy readability</li>
          <li>• Professional layout suitable for printing and official documentation</li>
        </ul>
      </div>
    </div>
  );
}

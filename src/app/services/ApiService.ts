import { API_ENDPOINTS } from '../config/api';
import { publicAnonKey } from '/utils/supabase/info';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

class ApiService {
  private async request(url: string, options: RequestInit = {}): Promise<ApiResponse> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Network error. Please check your connection.');
    }
  }

  // Authentication APIs
  async login(username: string, password: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async verifyEmail(email: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.passwordRecovery, {
      method: 'POST',
      body: JSON.stringify({ action: 'verify-email', email }),
    });
  }

  async resetPassword(email: string, newPassword: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.passwordRecovery, {
      method: 'POST',
      body: JSON.stringify({ action: 'reset-password', email, newPassword }),
    });
  }

  // User Management APIs
  async getUsers(search?: string): Promise<ApiResponse> {
    const url = search
      ? `${API_ENDPOINTS.usersList}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.usersList;
    return this.request(url);
  }

  async createUser(userData: {
    username: string;
    password: string;
    email: string;
    full_name: string;
    role: string;
    status: string;
  }): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.createUser, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: {
    username?: string;
    email?: string;
    full_name?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.updateUser, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...userData }),
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.deleteUser, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async toggleUserStatus(userId: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.toggleStatus, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Patient Records APIs
  async getPatients(search?: string): Promise<ApiResponse> {
    const url = search
      ? `${API_ENDPOINTS.patientsList}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.patientsList;
    return this.request(url);
  }

  async createPatient(patientData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.createPatient, {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(patientId: number, patientData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.updatePatient, {
      method: 'POST',
      body: JSON.stringify({ patient_id: patientId, ...patientData }),
    });
  }

  async deletePatient(patientId: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.deletePatient, {
      method: 'POST',
      body: JSON.stringify({ patient_id: patientId }),
    });
  }

  // Appointments APIs
  async getAppointments(search?: string): Promise<ApiResponse> {
    const url = search
      ? `${API_ENDPOINTS.appointmentsList}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.appointmentsList;
    return this.request(url);
  }

  async createAppointment(appointmentData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.createAppointment, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(appointmentId: number, appointmentData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.updateAppointment, {
      method: 'POST',
      body: JSON.stringify({ appointment_id: appointmentId, ...appointmentData }),
    });
  }

  async deleteAppointment(appointmentId: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.deleteAppointment, {
      method: 'POST',
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
  }

  // Treatment Records APIs
  async getTreatments(search?: string): Promise<ApiResponse> {
    const url = search
      ? `${API_ENDPOINTS.treatmentsList}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.treatmentsList;
    return this.request(url);
  }

  async createTreatment(treatmentData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.createTreatment, {
      method: 'POST',
      body: JSON.stringify(treatmentData),
    });
  }

  async updateTreatment(treatmentId: number, treatmentData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.updateTreatment, {
      method: 'POST',
      body: JSON.stringify({ treatment_id: treatmentId, ...treatmentData }),
    });
  }

  async deleteTreatment(treatmentId: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.deleteTreatment, {
      method: 'POST',
      body: JSON.stringify({ treatment_id: treatmentId }),
    });
  }
}

export default new ApiService();

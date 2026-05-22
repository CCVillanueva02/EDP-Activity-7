// API Configuration - Supabase Backend
import { projectId } from '/utils/supabase/info';

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9465c556`;

export const API_ENDPOINTS = {
  // Authentication
  login: `${API_BASE_URL}/auth/login`,
  passwordRecovery: `${API_BASE_URL}/auth/password-recovery`,

  // User Management
  usersList: `${API_BASE_URL}/users/list`,
  createUser: `${API_BASE_URL}/users/create`,
  updateUser: `${API_BASE_URL}/users/update`,
  deleteUser: `${API_BASE_URL}/users/delete`,
  toggleStatus: `${API_BASE_URL}/users/toggle-status`,

  // Patient Records
  patientsList: `${API_BASE_URL}/patients/list`,
  createPatient: `${API_BASE_URL}/patients/create`,
  updatePatient: `${API_BASE_URL}/patients/update`,
  deletePatient: `${API_BASE_URL}/patients/delete`,

  // Appointments
  appointmentsList: `${API_BASE_URL}/appointments/list`,
  createAppointment: `${API_BASE_URL}/appointments/create`,
  updateAppointment: `${API_BASE_URL}/appointments/update`,
  deleteAppointment: `${API_BASE_URL}/appointments/delete`,

  // Treatment Records
  treatmentsList: `${API_BASE_URL}/treatments/list`,
  createTreatment: `${API_BASE_URL}/treatments/create`,
  updateTreatment: `${API_BASE_URL}/treatments/update`,
  deleteTreatment: `${API_BASE_URL}/treatments/delete`,
};

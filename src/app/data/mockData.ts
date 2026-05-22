export const mockPatients = [
  { patient_id: 1, fname: 'Juan', lname: 'Dela Cruz', birthdate: '1995-05-10', contact_no: '09123456789' },
  { patient_id: 2, fname: 'Maria', lname: 'Santos', birthdate: '1998-03-21', contact_no: '09112223344' },
  { patient_id: 3, fname: 'Ana', lname: 'Reyes', birthdate: '2000-07-11', contact_no: '09113334455' },
  { patient_id: 4, fname: 'Pedro', lname: 'Lopez', birthdate: '1997-09-15', contact_no: '09114445566' },
  { patient_id: 5, fname: 'Carla', lname: 'Garcia', birthdate: '1996-12-01', contact_no: '09115556677' },
  { patient_id: 6, fname: 'Mark', lname: 'Torres', birthdate: '1999-02-14', contact_no: '09116667788' },
  { patient_id: 7, fname: 'Liza', lname: 'Gomez', birthdate: '1994-04-25', contact_no: '09117778899' },
  { patient_id: 8, fname: 'Paul', lname: 'Rivera', birthdate: '1993-08-30', contact_no: '09118889900' },
  { patient_id: 9, fname: 'Joy', lname: 'Fernandez', birthdate: '1992-01-20', contact_no: '09119990011' },
  { patient_id: 10, fname: 'Leo', lname: 'Martinez', birthdate: '1991-11-05', contact_no: '09110001122' },
];

export const mockDentists = [
  { dentist_id: 1, fname: 'Dr. Carlo', lname: 'Mendoza', specialization: 'Orthodontics' },
  { dentist_id: 2, fname: 'Dr. Angela', lname: 'Villanueva', specialization: 'Pediatric Dentistry' },
  { dentist_id: 3, fname: 'Dr. Brian', lname: 'Cruz', specialization: 'Oral Surgery' },
  { dentist_id: 4, fname: 'Dr. Sophia', lname: 'Lim', specialization: 'Cosmetic Dentistry' },
  { dentist_id: 5, fname: 'Dr. Daniel', lname: 'Ramos', specialization: 'Endodontics' },
  { dentist_id: 6, fname: 'Dr. Karen', lname: 'Flores', specialization: 'Periodontics' },
  { dentist_id: 7, fname: 'Dr. Michael', lname: 'Tan', specialization: 'General Dentistry' },
  { dentist_id: 8, fname: 'Dr. Camille', lname: 'Reyes', specialization: 'Prosthodontics' },
  { dentist_id: 9, fname: 'Dr. Patrick', lname: 'Navarro', specialization: 'Implant Dentistry' },
  { dentist_id: 10, fname: 'Dr. Nicole', lname: 'Santos', specialization: 'General Dentistry' },
];

export const mockServices = [
  { service_id: 1, service_name: 'Teeth Cleaning', price: 800.00 },
  { service_id: 2, service_name: 'Tooth Extraction', price: 1500.00 },
  { service_id: 3, service_name: 'Braces Installation', price: 35000.00 },
  { service_id: 4, service_name: 'Root Canal Treatment', price: 8000.00 },
  { service_id: 5, service_name: 'Dental Filling', price: 1200.00 },
  { service_id: 6, service_name: 'Teeth Whitening', price: 6000.00 },
  { service_id: 7, service_name: 'Dental Checkup', price: 500.00 },
  { service_id: 8, service_name: 'Dental Crown', price: 10000.00 },
  { service_id: 9, service_name: 'Dental Implant', price: 45000.00 },
  { service_id: 10, service_name: 'X-Ray', price: 700.00 },
];

export const mockAppointments = [
  { appointment_id: 1, patient_id: 1, dentist_id: 1, service_id: 1, appointment_date: '2026-03-01', appointment_status: 'Completed' },
  { appointment_id: 2, patient_id: 2, dentist_id: 2, service_id: 2, appointment_date: '2026-03-02', appointment_status: 'Scheduled' },
  { appointment_id: 3, patient_id: 3, dentist_id: 3, service_id: 3, appointment_date: '2026-03-03', appointment_status: 'Completed' },
  { appointment_id: 4, patient_id: 4, dentist_id: 4, service_id: 4, appointment_date: '2026-03-04', appointment_status: 'Cancelled' },
  { appointment_id: 5, patient_id: 5, dentist_id: 5, service_id: 5, appointment_date: '2026-03-05', appointment_status: 'Scheduled' },
  { appointment_id: 6, patient_id: 6, dentist_id: 6, service_id: 6, appointment_date: '2026-03-06', appointment_status: 'Completed' },
  { appointment_id: 7, patient_id: 7, dentist_id: 7, service_id: 7, appointment_date: '2026-03-07', appointment_status: 'Scheduled' },
  { appointment_id: 8, patient_id: 8, dentist_id: 8, service_id: 8, appointment_date: '2026-03-08', appointment_status: 'Completed' },
  { appointment_id: 9, patient_id: 9, dentist_id: 9, service_id: 9, appointment_date: '2026-03-09', appointment_status: 'Scheduled' },
  { appointment_id: 10, patient_id: 10, dentist_id: 10, service_id: 10, appointment_date: '2026-03-10', appointment_status: 'Completed' },
];

export const mockPayments = [
  { payment_id: 1, appointment_id: 1, amount: 800.00, payment_date: '2026-03-01' },
  { payment_id: 2, appointment_id: 2, amount: 500.00, payment_date: '2026-03-02' },
  { payment_id: 3, appointment_id: 3, amount: 1500.00, payment_date: '2026-03-03' },
  { payment_id: 4, appointment_id: 4, amount: 0.00, payment_date: '2026-03-04' },
  { payment_id: 5, appointment_id: 5, amount: 6000.00, payment_date: '2026-03-05' },
  { payment_id: 6, appointment_id: 6, amount: 1200.00, payment_date: '2026-03-06' },
  { payment_id: 7, appointment_id: 7, amount: 500.00, payment_date: '2026-03-07' },
  { payment_id: 8, appointment_id: 8, amount: 8000.00, payment_date: '2026-03-08' },
  { payment_id: 9, appointment_id: 9, amount: 700.00, payment_date: '2026-03-09' },
  { payment_id: 10, appointment_id: 10, amount: 10000.00, payment_date: '2026-03-10' },
];

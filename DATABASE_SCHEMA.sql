-- Dental Clinic Management System
-- Database Schema for MySQL

-- Create Database
CREATE DATABASE IF NOT EXISTS clinic_db;
USE clinic_db;

-- Users Table (New for Activity 5)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Staff', 'Dentist') NOT NULL DEFAULT 'Staff',
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Patients Table
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    birthdate DATE,
    contact_no VARCHAR(20)
);

-- Dentists Table
CREATE TABLE dentists (
    dentist_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    specialization VARCHAR(100)
);

-- Services Table
CREATE TABLE services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Appointments Table
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    dentist_id INT NOT NULL,
    service_id INT NOT NULL,
    appointment_date DATE,
    appointment_status VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (dentist_id) REFERENCES dentists(dentist_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Insert Sample Users
INSERT INTO users (username, password, email, full_name, role, status) VALUES
    ('admin', 'admin123', 'admin@dentalclinic.com', 'System Administrator', 'Admin', 'Active'),
    ('staff1', 'staff123', 'staff1@dentalclinic.com', 'Maria Santos', 'Staff', 'Active'),
    ('dentist1', 'dentist123', 'carlo.mendoza@dentalclinic.com', 'Dr. Carlo Mendoza', 'Dentist', 'Active'),
    ('staff2', 'staff123', 'staff2@dentalclinic.com', 'Juan Dela Cruz', 'Staff', 'Inactive');

-- Insert Sample Patients
INSERT INTO patients (fname, lname, birthdate, contact_no) VALUES
    ('Juan','Dela Cruz','1995-05-10','09123456789'),
    ('Maria','Santos','1998-03-21','09112223344'),
    ('Ana','Reyes','2000-07-11','09113334455'),
    ('Pedro','Lopez','1997-09-15','09114445566'),
    ('Carla','Garcia','1996-12-01','09115556677'),
    ('Mark','Torres','1999-02-14','09116667788'),
    ('Liza','Gomez','1994-04-25','09117778899'),
    ('Paul','Rivera','1993-08-30','09118889900'),
    ('Joy','Fernandez','1992-01-20','09119990011'),
    ('Leo','Martinez','1991-11-05','09110001122');

-- Insert Sample Dentists
INSERT INTO dentists (fname, lname, specialization) VALUES
    ('Dr. Carlo', 'Mendoza', 'Orthodontics'),
    ('Dr. Angela', 'Villanueva', 'Pediatric Dentistry'),
    ('Dr. Brian', 'Cruz', 'Oral Surgery'),
    ('Dr. Sophia', 'Lim', 'Cosmetic Dentistry'),
    ('Dr. Daniel', 'Ramos', 'Endodontics'),
    ('Dr. Karen', 'Flores', 'Periodontics'),
    ('Dr. Michael', 'Tan', 'General Dentistry'),
    ('Dr. Camille', 'Reyes', 'Prosthodontics'),
    ('Dr. Patrick', 'Navarro', 'Implant Dentistry'),
    ('Dr. Nicole', 'Santos', 'General Dentistry');

-- Insert Sample Services
INSERT INTO services (service_name, price) VALUES
    ('Teeth Cleaning', 800.00),
    ('Tooth Extraction', 1500.00),
    ('Braces Installation', 35000.00),
    ('Root Canal Treatment', 8000.00),
    ('Dental Filling', 1200.00),
    ('Teeth Whitening', 6000.00),
    ('Dental Checkup', 500.00),
    ('Dental Crown', 10000.00),
    ('Dental Implant', 45000.00),
    ('X-Ray', 700.00);

-- Insert Sample Appointments
INSERT INTO appointments (patient_id, dentist_id, service_id, appointment_date, appointment_status) VALUES
    (1, 1, 1, '2026-03-01', 'Completed'),
    (2, 2, 2, '2026-03-02', 'Scheduled'),
    (3, 3, 3, '2026-03-03', 'Completed'),
    (4, 4, 4, '2026-03-04', 'Cancelled'),
    (5, 5, 5, '2026-03-05', 'Scheduled'),
    (6, 6, 6, '2026-03-06', 'Completed'),
    (7, 7, 7, '2026-03-07', 'Scheduled'),
    (8, 8, 8, '2026-03-08', 'Completed'),
    (9, 9, 9, '2026-03-09', 'Scheduled'),
    (10, 10, 10, '2026-03-10', 'Completed');

-- Insert Sample Payments
INSERT INTO payments (appointment_id, amount, payment_date) VALUES
    (1, 800.00, '2026-03-01'),
    (2, 500.00, '2026-03-02'),
    (3, 1500.00, '2026-03-03'),
    (4, 0.00, '2026-03-04'),
    (5, 6000.00, '2026-03-05'),
    (6, 1200.00, '2026-03-06'),
    (7, 500.00, '2026-03-07'),
    (8, 8000.00, '2026-03-08'),
    (9, 700.00, '2026-03-09'),
    (10, 10000.00, '2026-03-10');

-- Views
CREATE VIEW view_patient_appointment AS
SELECT p.fname, p.lname, a.appointment_date, a.appointment_status
FROM patients p
JOIN appointments a ON p.patient_id = a.patient_id;

CREATE VIEW view_dentist_schedule AS
SELECT d.fname, d.lname, a.appointment_date
FROM dentists d
JOIN appointments a ON d.dentist_id = a.dentist_id;

CREATE VIEW view_payments_report AS
SELECT a.appointment_id, pay.amount, pay.payment_date
FROM appointments a
JOIN payments pay ON a.appointment_id = pay.appointment_id;

-- Stored Procedures
DELIMITER //

CREATE PROCEDURE GetPatientAppointments(IN pid INT)
BEGIN
    SELECT * FROM appointments
    WHERE patient_id = pid;
END //

CREATE FUNCTION GetTotalPayment(appID INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT SUM(amount) INTO total
    FROM payments
    WHERE appointment_id = appID;
    RETURN total;
END //

DELIMITER ;

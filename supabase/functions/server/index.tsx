import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize default users on server start
const initializeUsers = async () => {
  const existingUsers = await kv.get("users");
  if (!existingUsers) {
    const defaultUsers = [
      {
        user_id: 1,
        username: "admin",
        password: "admin123",
        email: "admin@dentalclinic.com",
        full_name: "Admin User",
        role: "Admin",
        status: "Active",
        last_login: null,
      },
      {
        user_id: 2,
        username: "staff1",
        password: "staff123",
        email: "staff1@dentalclinic.com",
        full_name: "Maria Garcia",
        role: "Staff",
        status: "Active",
        last_login: null,
      },
      {
        user_id: 3,
        username: "dentist1",
        password: "dentist123",
        email: "dentist1@dentalclinic.com",
        full_name: "Dr. John Smith",
        role: "Dentist",
        status: "Active",
        last_login: null,
      },
      {
        user_id: 4,
        username: "staff2",
        password: "staff123",
        email: "staff2@dentalclinic.com",
        full_name: "Sarah Johnson",
        role: "Staff",
        status: "Inactive",
        last_login: null,
      },
    ];
    await kv.set("users", defaultUsers);
    await kv.set("user_counter", 4);
    console.log("Initialized default users");
  }
};

// Initialize default data on server start
const initializeData = async () => {
  // Initialize patients
  const existingPatients = await kv.get("patients");
  if (!existingPatients) {
    await kv.set("patients", []);
    await kv.set("patient_counter", 0);
  }

  // Initialize appointments
  const existingAppointments = await kv.get("appointments");
  if (!existingAppointments) {
    await kv.set("appointments", []);
    await kv.set("appointment_counter", 0);
  }

  // Initialize treatments
  const existingTreatments = await kv.get("treatments");
  if (!existingTreatments) {
    await kv.set("treatments", []);
    await kv.set("treatment_counter", 0);
  }
};

// Initialize on startup
initializeUsers();
initializeData();

// Health check endpoint
app.get("/make-server-9465c556/health", (c) => {
  return c.json({ status: "ok" });
});

// AUTH ROUTES

// Login
app.post("/make-server-9465c556/auth/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({
        success: false,
        message: "Username and password are required",
      }, 400);
    }

    const users = await kv.get("users") || [];
    const user = users.find((u: any) => u.username === username);

    if (!user) {
      return c.json({
        success: false,
        message: "Invalid username or password",
      }, 401);
    }

    if (user.password !== password) {
      return c.json({
        success: false,
        message: "Invalid username or password",
      }, 401);
    }

    if (user.status !== "Active") {
      return c.json({
        success: false,
        message: "Account is inactive. Please contact administrator.",
      }, 403);
    }

    // Update last login
    user.last_login = new Date().toISOString();
    await kv.set("users", users);

    return c.json({
      success: true,
      message: "Login successful",
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return c.json({
      success: false,
      message: error.message || "Login failed",
    }, 500);
  }
});

// Password Recovery
app.post("/make-server-9465c556/auth/password-recovery", async (c) => {
  try {
    const { action, email, newPassword } = await c.req.json();

    const users = await kv.get("users") || [];

    if (action === "verify-email") {
      const user = users.find((u: any) => u.email === email);
      if (!user) {
        return c.json({
          success: false,
          message: "Email not found in our system",
        }, 404);
      }

      return c.json({
        success: true,
        message: "Email verified successfully",
      });
    } else if (action === "reset-password") {
      if (!newPassword || newPassword.length < 6) {
        return c.json({
          success: false,
          message: "Password must be at least 6 characters long",
        }, 400);
      }

      const userIndex = users.findIndex((u: any) => u.email === email);
      if (userIndex === -1) {
        return c.json({
          success: false,
          message: "Email not found",
        }, 404);
      }

      users[userIndex].password = newPassword;
      await kv.set("users", users);

      return c.json({
        success: true,
        message: "Password reset successfully",
      });
    } else {
      return c.json({
        success: false,
        message: "Invalid action",
      }, 400);
    }
  } catch (error: any) {
    console.error("Password recovery error:", error);
    return c.json({
      success: false,
      message: error.message || "Password recovery failed",
    }, 500);
  }
});

// USER MANAGEMENT ROUTES

// List Users (with search)
app.get("/make-server-9465c556/users/list", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const users = await kv.get("users") || [];

    let filteredUsers = users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter((u: any) =>
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.full_name.toLowerCase().includes(searchLower)
      );
    }

    return c.json({
      success: true,
      message: "Users retrieved successfully",
      data: filteredUsers,
    });
  } catch (error: any) {
    console.error("List users error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to retrieve users",
    }, 500);
  }
});

// Create User
app.post("/make-server-9465c556/users/create", async (c) => {
  try {
    const { username, password, email, full_name, role, status } = await c.req.json();

    if (!username || !password || !email || !full_name || !role || !status) {
      return c.json({
        success: false,
        message: "All fields are required",
      }, 400);
    }

    const users = await kv.get("users") || [];

    // Check for duplicates
    if (users.find((u: any) => u.username === username)) {
      return c.json({
        success: false,
        message: "Username already exists",
      }, 409);
    }

    if (users.find((u: any) => u.email === email)) {
      return c.json({
        success: false,
        message: "Email already exists",
      }, 409);
    }

    // Get next user ID
    const userId = (await kv.get("user_counter") || 0) + 1;
    await kv.set("user_counter", userId);

    const newUser = {
      user_id: userId,
      username,
      password,
      email,
      full_name,
      role,
      status,
      last_login: null,
    };

    users.push(newUser);
    await kv.set("users", users);

    return c.json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to create user",
    }, 500);
  }
});

// Update User
app.post("/make-server-9465c556/users/update", async (c) => {
  try {
    const { user_id, username, email, full_name, role, status } = await c.req.json();

    if (!user_id) {
      return c.json({
        success: false,
        message: "User ID is required",
      }, 400);
    }

    const users = await kv.get("users") || [];
    const userIndex = users.findIndex((u: any) => u.user_id === user_id);

    if (userIndex === -1) {
      return c.json({
        success: false,
        message: "User not found",
      }, 404);
    }

    // Check for duplicate username
    if (username && users.find((u: any, i: number) => u.username === username && i !== userIndex)) {
      return c.json({
        success: false,
        message: "Username already exists",
      }, 409);
    }

    // Check for duplicate email
    if (email && users.find((u: any, i: number) => u.email === email && i !== userIndex)) {
      return c.json({
        success: false,
        message: "Email already exists",
      }, 409);
    }

    // Update user
    if (username) users[userIndex].username = username;
    if (email) users[userIndex].email = email;
    if (full_name) users[userIndex].full_name = full_name;
    if (role) users[userIndex].role = role;
    if (status) users[userIndex].status = status;

    await kv.set("users", users);

    return c.json({
      success: true,
      message: "User updated successfully",
      data: users[userIndex],
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to update user",
    }, 500);
  }
});

// Delete User
app.post("/make-server-9465c556/users/delete", async (c) => {
  try {
    const { user_id } = await c.req.json();

    if (!user_id) {
      return c.json({
        success: false,
        message: "User ID is required",
      }, 400);
    }

    const users = await kv.get("users") || [];
    const userIndex = users.findIndex((u: any) => u.user_id === user_id);

    if (userIndex === -1) {
      return c.json({
        success: false,
        message: "User not found",
      }, 404);
    }

    users.splice(userIndex, 1);
    await kv.set("users", users);

    return c.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to delete user",
    }, 500);
  }
});

// Toggle User Status
app.post("/make-server-9465c556/users/toggle-status", async (c) => {
  try {
    const { user_id } = await c.req.json();

    if (!user_id) {
      return c.json({
        success: false,
        message: "User ID is required",
      }, 400);
    }

    const users = await kv.get("users") || [];
    const userIndex = users.findIndex((u: any) => u.user_id === user_id);

    if (userIndex === -1) {
      return c.json({
        success: false,
        message: "User not found",
      }, 404);
    }

    users[userIndex].status = users[userIndex].status === "Active" ? "Inactive" : "Active";
    await kv.set("users", users);

    return c.json({
      success: true,
      message: `User status changed to ${users[userIndex].status}`,
      data: users[userIndex],
    });
  } catch (error: any) {
    console.error("Toggle status error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to toggle user status",
    }, 500);
  }
});

// PATIENT RECORDS ROUTES

// List Patients
app.get("/make-server-9465c556/patients/list", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const patients = await kv.get("patients") || [];

    let filteredPatients = patients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = patients.filter((p: any) =>
        p.first_name.toLowerCase().includes(searchLower) ||
        p.last_name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.phone.includes(search)
      );
    }

    return c.json({
      success: true,
      message: "Patients retrieved successfully",
      data: filteredPatients,
    });
  } catch (error: any) {
    console.error("List patients error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to retrieve patients",
    }, 500);
  }
});

// Create Patient
app.post("/make-server-9465c556/patients/create", async (c) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, medical_history } = await c.req.json();

    if (!first_name || !last_name || !phone) {
      return c.json({
        success: false,
        message: "First name, last name, and phone are required",
      }, 400);
    }

    const patients = await kv.get("patients") || [];
    const patientId = (await kv.get("patient_counter") || 0) + 1;
    await kv.set("patient_counter", patientId);

    const newPatient = {
      patient_id: patientId,
      first_name,
      last_name,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      phone,
      email: email || null,
      address: address || null,
      medical_history: medical_history || null,
      created_at: new Date().toISOString(),
    };

    patients.push(newPatient);
    await kv.set("patients", patients);

    return c.json({
      success: true,
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (error: any) {
    console.error("Create patient error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to create patient",
    }, 500);
  }
});

// Update Patient
app.post("/make-server-9465c556/patients/update", async (c) => {
  try {
    const { patient_id, first_name, last_name, date_of_birth, gender, phone, email, address, medical_history } = await c.req.json();

    if (!patient_id) {
      return c.json({
        success: false,
        message: "Patient ID is required",
      }, 400);
    }

    const patients = await kv.get("patients") || [];
    const patientIndex = patients.findIndex((p: any) => p.patient_id === patient_id);

    if (patientIndex === -1) {
      return c.json({
        success: false,
        message: "Patient not found",
      }, 404);
    }

    if (first_name) patients[patientIndex].first_name = first_name;
    if (last_name) patients[patientIndex].last_name = last_name;
    if (date_of_birth !== undefined) patients[patientIndex].date_of_birth = date_of_birth;
    if (gender !== undefined) patients[patientIndex].gender = gender;
    if (phone) patients[patientIndex].phone = phone;
    if (email !== undefined) patients[patientIndex].email = email;
    if (address !== undefined) patients[patientIndex].address = address;
    if (medical_history !== undefined) patients[patientIndex].medical_history = medical_history;

    await kv.set("patients", patients);

    return c.json({
      success: true,
      message: "Patient updated successfully",
      data: patients[patientIndex],
    });
  } catch (error: any) {
    console.error("Update patient error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to update patient",
    }, 500);
  }
});

// Delete Patient
app.post("/make-server-9465c556/patients/delete", async (c) => {
  try {
    const { patient_id } = await c.req.json();

    if (!patient_id) {
      return c.json({
        success: false,
        message: "Patient ID is required",
      }, 400);
    }

    const patients = await kv.get("patients") || [];
    const patientIndex = patients.findIndex((p: any) => p.patient_id === patient_id);

    if (patientIndex === -1) {
      return c.json({
        success: false,
        message: "Patient not found",
      }, 404);
    }

    patients.splice(patientIndex, 1);
    await kv.set("patients", patients);

    return c.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete patient error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to delete patient",
    }, 500);
  }
});

// APPOINTMENT ROUTES

// List Appointments
app.get("/make-server-9465c556/appointments/list", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const appointments = await kv.get("appointments") || [];

    let filteredAppointments = appointments;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAppointments = appointments.filter((a: any) =>
        a.patient_name.toLowerCase().includes(searchLower) ||
        a.dentist_name.toLowerCase().includes(searchLower) ||
        a.status.toLowerCase().includes(searchLower)
      );
    }

    return c.json({
      success: true,
      message: "Appointments retrieved successfully",
      data: filteredAppointments,
    });
  } catch (error: any) {
    console.error("List appointments error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to retrieve appointments",
    }, 500);
  }
});

// Create Appointment
app.post("/make-server-9465c556/appointments/create", async (c) => {
  try {
    const { patient_id, patient_name, dentist_id, dentist_name, appointment_date, appointment_time, service_type, status, notes } = await c.req.json();

    if (!patient_name || !dentist_name || !appointment_date || !appointment_time) {
      return c.json({
        success: false,
        message: "Patient name, dentist name, date, and time are required",
      }, 400);
    }

    const appointments = await kv.get("appointments") || [];
    const appointmentId = (await kv.get("appointment_counter") || 0) + 1;
    await kv.set("appointment_counter", appointmentId);

    const newAppointment = {
      appointment_id: appointmentId,
      patient_id: patient_id || null,
      patient_name,
      dentist_id: dentist_id || null,
      dentist_name,
      appointment_date,
      appointment_time,
      service_type: service_type || "General Checkup",
      status: status || "Scheduled",
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    await kv.set("appointments", appointments);

    return c.json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error: any) {
    console.error("Create appointment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to create appointment",
    }, 500);
  }
});

// Update Appointment
app.post("/make-server-9465c556/appointments/update", async (c) => {
  try {
    const { appointment_id, patient_name, dentist_name, appointment_date, appointment_time, service_type, status, notes } = await c.req.json();

    if (!appointment_id) {
      return c.json({
        success: false,
        message: "Appointment ID is required",
      }, 400);
    }

    const appointments = await kv.get("appointments") || [];
    const appointmentIndex = appointments.findIndex((a: any) => a.appointment_id === appointment_id);

    if (appointmentIndex === -1) {
      return c.json({
        success: false,
        message: "Appointment not found",
      }, 404);
    }

    if (patient_name) appointments[appointmentIndex].patient_name = patient_name;
    if (dentist_name) appointments[appointmentIndex].dentist_name = dentist_name;
    if (appointment_date) appointments[appointmentIndex].appointment_date = appointment_date;
    if (appointment_time) appointments[appointmentIndex].appointment_time = appointment_time;
    if (service_type) appointments[appointmentIndex].service_type = service_type;
    if (status) appointments[appointmentIndex].status = status;
    if (notes !== undefined) appointments[appointmentIndex].notes = notes;

    await kv.set("appointments", appointments);

    return c.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointments[appointmentIndex],
    });
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to update appointment",
    }, 500);
  }
});

// Delete Appointment
app.post("/make-server-9465c556/appointments/delete", async (c) => {
  try {
    const { appointment_id } = await c.req.json();

    if (!appointment_id) {
      return c.json({
        success: false,
        message: "Appointment ID is required",
      }, 400);
    }

    const appointments = await kv.get("appointments") || [];
    const appointmentIndex = appointments.findIndex((a: any) => a.appointment_id === appointment_id);

    if (appointmentIndex === -1) {
      return c.json({
        success: false,
        message: "Appointment not found",
      }, 404);
    }

    appointments.splice(appointmentIndex, 1);
    await kv.set("appointments", appointments);

    return c.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete appointment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to delete appointment",
    }, 500);
  }
});

// TREATMENT RECORDS ROUTES

// List Treatments
app.get("/make-server-9465c556/treatments/list", async (c) => {
  try {
    const search = c.req.query("search") || "";
    const treatments = await kv.get("treatments") || [];

    let filteredTreatments = treatments;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTreatments = treatments.filter((t: any) =>
        t.patient_name.toLowerCase().includes(searchLower) ||
        t.dentist_name.toLowerCase().includes(searchLower) ||
        t.treatment_type.toLowerCase().includes(searchLower)
      );
    }

    return c.json({
      success: true,
      message: "Treatments retrieved successfully",
      data: filteredTreatments,
    });
  } catch (error: any) {
    console.error("List treatments error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to retrieve treatments",
    }, 500);
  }
});

// Create Treatment
app.post("/make-server-9465c556/treatments/create", async (c) => {
  try {
    const { patient_id, patient_name, dentist_id, dentist_name, treatment_date, treatment_type, description, cost, payment_status, notes } = await c.req.json();

    if (!patient_name || !dentist_name || !treatment_date || !treatment_type || !cost) {
      return c.json({
        success: false,
        message: "Patient name, dentist name, date, treatment type, and cost are required",
      }, 400);
    }

    const treatments = await kv.get("treatments") || [];
    const treatmentId = (await kv.get("treatment_counter") || 0) + 1;
    await kv.set("treatment_counter", treatmentId);

    const newTreatment = {
      treatment_id: treatmentId,
      patient_id: patient_id || null,
      patient_name,
      dentist_id: dentist_id || null,
      dentist_name,
      treatment_date,
      treatment_type,
      description: description || null,
      cost: parseFloat(cost),
      payment_status: payment_status || "Pending",
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    treatments.push(newTreatment);
    await kv.set("treatments", treatments);

    return c.json({
      success: true,
      message: "Treatment created successfully",
      data: newTreatment,
    });
  } catch (error: any) {
    console.error("Create treatment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to create treatment",
    }, 500);
  }
});

// Update Treatment
app.post("/make-server-9465c556/treatments/update", async (c) => {
  try {
    const { treatment_id, patient_name, dentist_name, treatment_date, treatment_type, description, cost, payment_status, notes } = await c.req.json();

    if (!treatment_id) {
      return c.json({
        success: false,
        message: "Treatment ID is required",
      }, 400);
    }

    const treatments = await kv.get("treatments") || [];
    const treatmentIndex = treatments.findIndex((t: any) => t.treatment_id === treatment_id);

    if (treatmentIndex === -1) {
      return c.json({
        success: false,
        message: "Treatment not found",
      }, 404);
    }

    if (patient_name) treatments[treatmentIndex].patient_name = patient_name;
    if (dentist_name) treatments[treatmentIndex].dentist_name = dentist_name;
    if (treatment_date) treatments[treatmentIndex].treatment_date = treatment_date;
    if (treatment_type) treatments[treatmentIndex].treatment_type = treatment_type;
    if (description !== undefined) treatments[treatmentIndex].description = description;
    if (cost) treatments[treatmentIndex].cost = parseFloat(cost);
    if (payment_status) treatments[treatmentIndex].payment_status = payment_status;
    if (notes !== undefined) treatments[treatmentIndex].notes = notes;

    await kv.set("treatments", treatments);

    return c.json({
      success: true,
      message: "Treatment updated successfully",
      data: treatments[treatmentIndex],
    });
  } catch (error: any) {
    console.error("Update treatment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to update treatment",
    }, 500);
  }
});

// Delete Treatment
app.post("/make-server-9465c556/treatments/delete", async (c) => {
  try {
    const { treatment_id } = await c.req.json();

    if (!treatment_id) {
      return c.json({
        success: false,
        message: "Treatment ID is required",
      }, 400);
    }

    const treatments = await kv.get("treatments") || [];
    const treatmentIndex = treatments.findIndex((t: any) => t.treatment_id === treatment_id);

    if (treatmentIndex === -1) {
      return c.json({
        success: false,
        message: "Treatment not found",
      }, 404);
    }

    treatments.splice(treatmentIndex, 1);
    await kv.set("treatments", treatments);

    return c.json({
      success: true,
      message: "Treatment deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete treatment error:", error);
    return c.json({
      success: false,
      message: error.message || "Failed to delete treatment",
    }, 500);
  }
});

Deno.serve(app.fetch);
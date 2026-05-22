import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { PasswordRecovery } from "./components/PasswordRecovery";
import { Dashboard } from "./components/Dashboard";
import { Patients } from "./components/Patients";
import { Dentists } from "./components/Dentists";
import { Appointments } from "./components/Appointments";
import { Services } from "./components/Services";
import { Payments } from "./components/Payments";
import { Reports } from "./components/Reports";
import { About } from "./components/About";
import { UserManagement } from "./components/UserManagement";
import { PatientRecords } from "./components/PatientRecords";
import { TreatmentRecords } from "./components/TreatmentRecords";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/password-recovery",
    Component: PasswordRecovery,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: PatientRecords },
      { path: "dentists", Component: Dentists },
      { path: "appointments", Component: Appointments },
      { path: "services", Component: Services },
      { path: "payments", Component: Payments },
      { path: "treatments", Component: TreatmentRecords },
      { path: "reports", Component: Reports },
      { path: "users", Component: UserManagement },
      { path: "about", Component: About },
    ],
  },
]);

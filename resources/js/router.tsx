import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import EditSDGMapping from "./components/admin/monitoring-form/sdg-mapping/EditSDGMapping";
import EditAgendaMapping from "./components/admin/monitoring-form/agenda-mapping/EditAgendaMapping";
// import Test from "./Test";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AddFaculty from "./components/admin/users/faculty/AddFaculty";
import Faculties from "./components/admin/users/faculty/Faculties";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import Coordinators from "./components/admin/users/coordinators/Coordinators";
import AddCoordinator from "./components/admin/users/coordinators/AddCoordinator";
import ErrorPage from "./pages/ErrorPage";
import CoordinatorDetails from "./components/admin/users/coordinators/CoordinatorDetails";
import FacultyDetails from "./components/admin/users/faculty/FacultyDetails";
import GuestLayout from "./components/layout/GuestLayout";
import FacultyDashboard from "./components/faculty/FacultyDashboard";
import FacultyMonitoringForms from "./components/faculty/MonitoringForm";
import FacultyLayout from "./components/layout/FacultyLayout";
import ResearchCoordinatorLayout from "./components/layout/ResearchCoordinatorLayout";
import CoordinatorDashboard from "./components/ResearchCoordinator/CoordinatorDashboard";
import CoordinatorSettings from "./components/ResearchCoordinator/CoordinatorSettings";
import PendingMonitoringForms from "./components/ResearchCoordinator/PendingMonitoringForms";
import ApprovedMonitoringForm from "./components/ResearchCoordinator/ApprovedMonitoringForms";
import MonitoringForm from "./components/ResearchCoordinator/MonitoringForm";
import MonitoringFormsContextProvider from "./components/ResearchCoordinator/hooks/MonitoringFormsContextProvider";
import { SDGMapping } from "./components/admin/monitoring-form/sdg-mapping/SDGMapping";
import AgendaMapping from "./components/admin/monitoring-form/agenda-mapping/AgendaMapping";
import Settings from "./components/admin/settings/Settings";
import AddSDGMapping from "./components/admin/monitoring-form/sdg-mapping/AddSDGMapping";
import AddAgendaMapping from "./components/admin/monitoring-form/agenda-mapping/AddAgendaMapping";
import ProfileSettings from "./components/admin/settings/ProfileSettings";
import ResearchMonitoring from "./components/admin/monitoring-form/ResearchMonitoring";
import ResearchSubmissions from "./components/admin/monitoring-form/ResearchSubmissions";
import PendingResearch from "./components/admin/monitoring-form/PendingResearch";
import FacultySettings from "./components/faculty/FacultySettings";
import MonitoringFormDetails from "./components/faculty/MonitoringFormDetails";
import { Tests } from "./tests";
import PointsManagementLayout from "./components/admin/settings/points/PointsManagementLayout";
import AwardsManagement from "./components/admin/settings/awards/AwardsManagement";
import AdminMonitoringFormDetails from "./components/admin/monitoring-form/monitoring-forms/AdminMonitoringFormDetails";
import ResearchAcceptingDate from "./components/admin/monitoring-form/ResearchAcceptingDate";
import EditAcceptingDate from "./components/admin/monitoring-form/EditAcceptingDate";
import Test from "./Test";
import PasswordSettings from "./components/admin/settings/PasswordSettings";
import CreateResearchMonitoringForm from "./components/faculty/submit-monitoring-form/CreateResearchMonitoringForm";
import Reports from "./components/admin/reports/Reports";
import FPESPreview from "./components/admin/reports/FPESPreview";
import ArchivedResearch from "./components/admin/monitoring-form/ArchivedResearch";
import ArchivedSubmissions from "./components/faculty/submit-monitoring-form/ArchivedSubmissions";
import Backup from "./components/admin/settings/Backup";
import Register from "./pages/Register";

const router = createBrowserRouter([
  // =================================
  // Landing Page
  // =================================
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      // =================================
      // Login
      // =================================
      {
        path: "/login",
        element: <GuestLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // =================================
  // Admin
  // =================================
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRole="admin" redirectPath="/404">
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
      },

      // Coordinator
      {
        path: "/manage-coordinators",
        element: <Coordinators />,
      },
      {
        path: "/add-coordinator",
        element: <AddCoordinator />,
      },
      {
        path: "/coordinator/:id/edit",
        element: <CoordinatorDetails />,
      },

      // Faculty
      {
        path: "/manage-faculty",
        element: <Faculties />,
      },
      {
        path: "/add-faculty",
        element: <AddFaculty />,
      },
      {
        path: "/faculty/:id/edit",
        element: <FacultyDetails />,
      },


      // Monitoring Form
      {
        path: "/research-monitoring",
        element: <ResearchMonitoring />,
        children: [
          {
            path: "set-date",
            element: <ResearchAcceptingDate />,
          },
          {
            path: "edit-date",
            element: <EditAcceptingDate />,
          },
          {
            path: "pending-research",
            element: <PendingResearch />,
          },
          {
            path: "submissions",
            element: <ResearchSubmissions />,
          },
          {
            path: "archived",
            element: <ArchivedResearch />,
          },
          {
            path: ":id",
            element: <AdminMonitoringFormDetails />,
          },
        ],
      },
      //Reports
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/report-preview",
        element: <FPESPreview />,
      },

      // Settings
      {
        path: "/admin-settings",
        element: <Settings />,
        children: [
          {
            path: "profile",
            element: <ProfileSettings />,
          },
          {
            path: "update-password",
            element: <PasswordSettings />,
          },

          // SDG Mapping
          {
            path: "sdg-mapping",
            element: <SDGMapping />,
          },
          {
            path: "sdg-mapping/add-sdg",
            element: <AddSDGMapping />,
          },

          {
            path: "sdg-mapping/edit-sdg/:id",
            element: <EditSDGMapping />,
          },

          // Agenda Mapping
          {
            path: "agenda-mapping",
            element: <AgendaMapping />,
          },
          {
            path: "agenda-mapping/add-agenda",
            element: <AddAgendaMapping />,
          },
          {
            path: "agenda-mapping/edit-agenda/:id",
            element: <EditAgendaMapping />,
          },



          {
            path: "points",
            element: <PointsManagementLayout />,
          },
          {
            path: "awards",
            element: <AwardsManagement />,
          },
          {
            path: "backup",
            element: <Backup />,
          },

        ],
      },
    ],
  },

  // =================================
  // Coordinator
  // =================================
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRole="research-coordinator" redirectPath="/404">
        <MonitoringFormsContextProvider>
          <ResearchCoordinatorLayout />
        </MonitoringFormsContextProvider>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/pending",
        element: <PendingMonitoringForms />,
      },
      {
        path: "/coordinator-dashboard",
        element: <CoordinatorDashboard />,
      },
      {
        path: "/approved",
        element: <ApprovedMonitoringForm />,
      },
      {
        path: "/research-monitoring-form/:id",
        element: <MonitoringForm />,
      },
      {
        path: "/coordinator-settings",
        element: <CoordinatorSettings />,
      },
    ],
  },

  // =================================
  // Faculty
  // =================================
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRole="faculty" redirectPath="/404">
        <FacultyLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/faculty-dashboard",
        element: <FacultyDashboard />,
      },
      {
        path: "/research-monitoring-form",
        element: <FacultyMonitoringForms />,
      },
      {
        path: "/create/research-monitoring-form",
        // element: <CreateMonitoringForm />,
        element: <CreateResearchMonitoringForm />,
      },
      {
        path: "/faculty/archived",
        element: <ArchivedSubmissions />,
      },
      {
        path: "/faculty-settings",
        element: <FacultySettings />,
      },
      {
        path: "/faculty/research-monitoring-form/:id",
        element: <MonitoringFormDetails />,
      },
    ],
  },

  // =================================
  // Error Page
  // =================================
  {
    path: "/404",
    element: <ErrorPage />,
  },
  {
    path: "/*",
    element: <ErrorPage />,
  },

  // =================================
  // Testing
  // =================================
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/tests",
    element: <Tests />,
  },
]);

export default router;

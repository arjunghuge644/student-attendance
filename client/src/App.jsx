import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MarkAttendance from "./pages/MarkAttendance";
import History from "./pages/History";
import Reports from "./pages/Reports";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminStudents from "./pages/admin/AdminStudents";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import Toaster from "./components/Toaster";
import "./index.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function AppContent() {
  const { activePage, toast, closeToast } = useApp();
  const { user } = useAuth();

  const renderPage = () => {
    const role = user?.role || "faculty";

    if (role === "admin") {
      switch (activePage) {
        case "dashboard": return <Dashboard />;
        case "courses":   return <AdminCourses />;
        case "faculty":   return <AdminFaculty />;
        case "students":  return <AdminStudents />;
        case "reports":   return <Reports />;
        default:          return <Dashboard />;
      }
    }

    if (role === "student") {
      switch (activePage) {
        case "dashboard": return <StudentDashboard />;
        case "history":   return <StudentAttendance />;
        default:          return <StudentDashboard />;
      }
    }

    switch (activePage) {
      case "dashboard":  return <Dashboard />;
      case "attendance": return <MarkAttendance />;
      case "history":    return <History />;
      case "reports":    return <Reports />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="main-content">
        <Header page={activePage} />
        <div style={{ flex: 1, minHeight: 0 }}>
             {renderPage()}
        </div>
        <Toaster toast={toast} onClose={closeToast} />
      </div>
    </div>
  );
}

function AuthGate() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

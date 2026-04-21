import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { token, user, getAuthHeader } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [toast, setToast] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/students`, { headers: getAuthHeader() });
      if (res.ok) setStudents(await res.json());
    } catch (err) { console.error("Fetch students error:", err); }
  }, [token, getAuthHeader]);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/courses`, { headers: getAuthHeader() });
      if (res.ok) setCourses(await res.json());
    } catch (err) { console.error("Fetch courses error:", err); }
  }, [token, getAuthHeader]);

  const fetchFaculty = useCallback(async () => {
    if (!token || (user?.role !== 'admin' && user?.role !== 'faculty')) return;
    const endpoint = user?.role === 'admin' ? '/admin/faculty' : '/admin/faculty'; // Can be refined
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { headers: getAuthHeader() });
      if (res.ok) setFaculty(await res.json());
    } catch (err) { console.error("Fetch faculty error:", err); }
  }, [token, user?.role, getAuthHeader]);

  const fetchDashboardStats = useCallback(async () => {
    if (!token || user?.role === 'student') return;
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: getAuthHeader() });
      if (res.ok) setDashboardStats(await res.json());
    } catch (err) { console.error("Fetch stats error:", err); }
  }, [token, user?.role, getAuthHeader]);

  const fetchReportsData = useCallback(async () => {
    if (!token || user?.role === 'student') return;
    try {
      const res = await fetch(`${API_URL}/admin/reports`, { headers: getAuthHeader() });
      if (res.ok) setReportsData(await res.json());
    } catch (err) { console.error("Fetch reports error:", err); }
  }, [token, user?.role, getAuthHeader]);

  // Mutators
  const addStudent = async (studentData) => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        fetchStudents();
        notify("Student registered successfully!");
      } else {
        const err = await res.json();
        notify(err.message || "Failed to add student", "error");
      }
    } catch (err) { notify("Network error", "error"); }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`, { method: "DELETE", headers: getAuthHeader() });
      if (res.ok) {
        fetchStudents();
        notify("Student removed.");
      }
    } catch (err) { notify("Delete failed", "error"); }
  };

  const addCourse = async (courseData) => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        fetchCourses();
        notify("Course created.");
      }
    } catch (err) { notify("Failed to create course", "error"); }
  };

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, { method: "DELETE", headers: getAuthHeader() });
      if (res.ok) {
        fetchCourses();
        notify("Course deleted.");
      }
    } catch (err) { notify("Delete failed", "error"); }
  };

  const registerFaculty = async (facultyData) => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...facultyData, role: 'faculty' })
      });
      if (res.ok) {
        fetchFaculty();
        notify("Faculty registered!");
      } else {
        const err = await res.json();
        notify(err.message || "Failed to register faculty", "error");
      }
    } catch (err) { notify("Network error", "error"); }
  };

  const assignCoursesToFaculty = async (facultyId, courseIds) => {
    try {
      const res = await fetch(`${API_URL}/admin/faculty/${facultyId}/courses`, {
        method: "PUT",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ courses: courseIds })
      });
      if (res.ok) {
        fetchFaculty();
        notify("Courses assigned.");
      }
    } catch (err) { notify("Assignment failed", "error"); }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, { method: "DELETE", headers: getAuthHeader() });
      if (res.ok) {
        fetchFaculty();
        notify("User deleted.");
      }
    } catch (err) { notify("Delete failed", "error"); }
  };

  const saveAttendance = async (data) => {
    try {
      const res = await fetch(`${API_URL}/attendance`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        notify("Attendance saved!");
        fetchDashboardStats();
        return true;
      }
      return false;
    } catch (err) { notify("Save failed", "error"); return false; }
  };

  const getAttendanceForDate = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/attendance?${query}`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (err) { console.error("Get attendance error:", err); }
    return null;
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([
        fetchStudents(), 
        fetchCourses(), 
        fetchFaculty(), 
        fetchDashboardStats(), 
        fetchReportsData()
      ]).finally(() => setLoading(false));
    }
  }, [token, fetchStudents, fetchCourses, fetchFaculty, fetchDashboardStats, fetchReportsData]);

  return (
    <AppContext.Provider value={{ 
      students, courses, faculty, loading, activePage, setActivePage,
      dashboardStats, reportsData, toast, closeToast: () => setToast(null),
      addStudent, deleteStudent, addCourse, deleteCourse,
      registerFaculty, deleteUser, assignCoursesToFaculty,
      saveAttendance, getAttendanceForDate, notify
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

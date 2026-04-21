import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, ClipboardCheck,
  History, BarChart3, GraduationCap, LogOut, ChevronDown, Shield, BookOpen, Briefcase
} from "lucide-react";

export default function Sidebar() {
  const { activePage, setActivePage, students } = useApp();
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  // Initials fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AT";

  const getNavItems = () => {
    const role = user?.role || "faculty";
    
    if (role === "admin") {
      return [
        { id: "dashboard",  label: "Admin Overview",   icon: LayoutDashboard },
        { id: "courses",    label: "Manage Courses",   icon: BookOpen },
        { id: "faculty",    label: "Manage Faculty",   icon: Briefcase },
        { id: "students",   label: "Manage Students",  icon: Users },
        { id: "reports",    label: "System Reports",   icon: BarChart3 },
      ];
    }
    
    if (role === "student") {
      return [
        { id: "dashboard",  label: "My Progress",      icon: LayoutDashboard },
        { id: "history",    label: "Attendance Logs",  icon: History },
      ];
    }

    // Default: Faculty
    return [
      { id: "dashboard",  label: "Dashboard",       icon: LayoutDashboard },
      { id: "attendance", label: "Mark Attendance",  icon: ClipboardCheck },
      { id: "history",    label: "History",          icon: History },
      { id: "reports",    label: "Class Reports",    icon: BarChart3 },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="logo-icon">
            <GraduationCap size={22} color="#fff" />
          </div>
          <div className="logo-text">
            <h2>AttendX</h2>
            <span>{user?.role?.toUpperCase()} PORTAL</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Main Menu</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`nav-item ${activePage === id ? "active" : ""}`}
            onClick={() => setActivePage(id)}
          >
            <Icon className="nav-icon" size={18} />
            <span>{label}</span>
            {id === "students" && user?.role === "admin" && (
              <span className="nav-badge">{students.length}</span>
            )}
          </div>
        ))}
      </nav>


      <div className="sidebar-footer">
        {/* User Card */}
        <div
          className="sidebar-user"
          style={{ cursor: "pointer", position: "relative" }}
          onClick={() => setShowLogout((p) => !p)}
        >
          {/* Avatar: photo or initials */}
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="user-avatar">{initials}</div>
          )}

          <div className="user-info-text">
            <strong title={user?.name}>{user?.name || "Faculty"}</strong>
            <span title={user?.email}>{user?.email || "moderncoe.edu.in"}</span>
          </div>

          <ChevronDown
            size={14}
            color="var(--text-muted)"
            style={{ transition: "transform 0.2s", transform: showLogout ? "rotate(180deg)" : "none", flexShrink: 0 }}
          />

          {/* Logout popover */}
          {showLogout && (
            <div
              style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,
                background: "#1a1a2e", border: "1px solid var(--border)",
                borderRadius: 10, overflow: "hidden", zIndex: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Signed in as</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  width: "100%", padding: "12px 14px", background: "none", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  color: "var(--red)", fontSize: 13, fontWeight: 500,
                  transition: "background 0.15s", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--red-soft)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

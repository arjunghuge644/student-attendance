import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Users, Shield, Settings, Database, 
  Trash2, UserPlus, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const uRes = await fetch("http://localhost:5000/api/admin/users", {
        headers: { "x-user-email": user.email }
      });
      if (uRes.ok) setUsers(await uRes.json());

      // Fetch stats
      const sRes = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { "x-user-email": user.email }
      });
      if (sRes.ok) setStats(await sRes.json());
    } catch (err) {
      console.error("Admin data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="page fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <div className="card" style={{ maxWidth: 400, textAlign: "center", padding: 40 }}>
          <Shield size={48} color="var(--red)" style={{ marginBottom: 20 }} />
          <h2>Access Denied</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 10 }}>
            You do not have administrative privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Admin Control Panel</h1>
        <p style={{ color: "var(--text-muted)" }}>Manage users, system configurations, and database operations.</p>
      </div>

      {/* Admin Stats */}
      <div className="stats-grid" style={{ marginBottom: 30 }}>
        <div className="stat-card">
          <div className="stat-top"><Users size={20} color="var(--indigo)" /></div>
          <div className="stat-value">{stats?.studentCount || 0}</div>
          <div className="stat-label">System Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><Shield size={20} color="var(--green)" /></div>
          <div className="stat-value">{stats?.facultyCount || 0}</div>
          <div className="stat-label">Faculty Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><Database size={20} color="var(--yellow)" /></div>
          <div className="stat-value">{stats?.recentAttendance?.length || 0}</div>
          <div className="stat-label">Recent Logs</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* User Management */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">User Management</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: 16 }}>User</th>
                  <th style={{ padding: 16 }}>Email</th>
                  <th style={{ padding: 16 }}>Role</th>
                  <th style={{ padding: 16 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={u.picture} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </td>
                    <td style={{ padding: 16, color: "var(--text-muted)", fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: 16 }}>
                      <span className={`badge ${u.role}`} style={{ textTransform: "capitalize" }}>{u.role}</span>
                    </td>
                    <td style={{ padding: 16 }}>
                      <button className="btn-icon" title="Toggle Role"><Shield size={16} /></button>
                      <button className="btn-icon red" title="Remove User"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Settings Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">System Actions</div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
                <UserPlus size={18} /> Bulk Import Students
              </button>
              <button className="btn secondary" style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border)" }}>
                <AlertCircle size={18} /> Reset Today's Attendance
              </button>
              <button className="btn secondary" style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border)", color: "var(--red)" }}>
                <Trash2 size={18} /> Clear Old Logs
              </button>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: "rgba(99, 102, 241, 0.05)", borderRadius: 12, border: "1px dashed var(--indigo)" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14 }}>
                <CheckCircle2 size={16} color="var(--indigo)" /> System Status
              </h4>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Database connected. All systems operational. Last backup: 2 hours ago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

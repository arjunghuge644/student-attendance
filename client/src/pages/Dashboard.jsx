import React from "react";
import { useApp } from "../context/AppContext";
import {
  Users, UserCheck, UserX, Clock, TrendingUp,
  CheckCircle2, XCircle, BookOpen, Award, AlertTriangle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];
const CLASS_COLORS = { FY: "#6366f1", SE: "#10b981", TE: "#f59e0b", BE: "#ef4444" };

export default function Dashboard() {
  const { dashboardStats, reportsData, loading } = useApp();

  if (loading || !dashboardStats) {
    return <div className="page fade-in" style={{ padding: 100, textAlign: "center" }}>Loading dashboard insights...</div>;
  }

  const { studentCount, facultyCount, courseCount, recentAttendance } = dashboardStats;
  const { classAverages, topPerformers, atRiskStudents } = reportsData || { classAverages: [], topPerformers: [], atRiskStudents: [] };

  return (
    <div className="page fade-in">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap indigo"><Users size={20} /></div></div>
          <div className="stat-value">{studentCount}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap blue"><BookOpen size={20} /></div></div>
          <div className="stat-value">{courseCount}</div>
          <div className="stat-label">Active Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap yellow"><Award size={20} /></div></div>
          <div className="stat-value">{facultyCount}</div>
          <div className="stat-label">Faculty Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap red"><AlertTriangle size={20} /></div></div>
          <div className="stat-value">{atRiskStudents.length}</div>
          <div className="stat-label">Critical Attendance</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {classAverages.map(({ name, rate }) => (
          <div key={name} className="card" style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{name} CLASS</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: CLASS_COLORS[name] }}>{rate}%</span>
            </div>
            <div className="progress-wrap"><div className="progress-bar" style={{ width: `${rate}%`, background: CLASS_COLORS[name] }} /></div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Marked Attendance</div></div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((a) => (
                    <tr key={a._id}>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td><strong>{a.course?.name || "N/A"}</strong></td>
                      <td><span className="info-chip">{a.class}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Top Students</div></div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            {topPerformers.slice(0, 5).map((s, i) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 24, fontWeight: 800, color: "var(--text-muted)" }}>{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.rollNo}</div>
                </div>
                <div className="badge present">{s.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { useApp } from "../context/AppContext";
import {
  TrendingUp, Users, Award, AlertTriangle,
  BarChart, Calendar, BookOpen
} from "lucide-react";
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from "recharts";

const CLASS_COLORS = { FY: "#6366f1", SE: "#10b981", TE: "#f59e0b", BE: "#ef4444" };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px" }}>
        <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { reportsData, loading } = useApp();

  if (loading || !reportsData) {
    return <div className="page fade-in" style={{ textAlign: "center", padding: 100 }}>Generating college reports...</div>;
  }

  const { classAverages, topPerformers, atRiskStudents } = reportsData;

  const collegeAvg = Math.round(classAverages.reduce((acc, c) => acc + c.rate, 0) / classAverages.length) || 0;

  const downloadCSV = () => {
    const headers = ["Name", "Roll No", "Class", "Attendance Rate", "Total Sessions"];
    const rows = atRiskStudents.map(s => [s.name, s.rollNo, s.class, `${s.percentage}%`, s.totalSessions]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `at_risk_students_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <div className="page fade-in">
      <div className="toolbar">
        <div className="toolbar-left">
            <p className="text-secondary" style={{ fontSize: 13 }}>Analyze and monitor student performance across the institution.</p>
        </div>
        <div className="toolbar-right">
            <button className="btn btn-secondary" onClick={downloadCSV} disabled={atRiskStudents.length === 0}>
               Download Risk Report (CSV)
            </button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap indigo"><TrendingUp size={20} /></div></div>
          <div className="stat-value">{collegeAvg}%</div>
          <div className="stat-label">College Avg. Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap green"><Award size={20} /></div></div>
          <div className="stat-value">{topPerformers.filter(s => s.percentage >= 90).length}</div>
          <div className="stat-label">High Performers (90%+)</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap red"><AlertTriangle size={20} /></div></div>
          <div className="stat-value">{atRiskStudents.length}</div>
          <div className="stat-label">Students Below 75%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Class-wise Performance</div></div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <ReBarChart data={classAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8888aa", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8888aa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Avg Attendance" radius={[10, 10, 0, 0]}>
                  {classAverages.map((entry, index) => (
                    <Cell key={index} fill={CLASS_COLORS[entry.name]} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Top 10 Performers</div></div>
          <div className="card-body" style={{ padding: "16px 24px" }}>
            <div className="activity-list">
              {topPerformers.map((s, i) => (
                <div key={s._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < topPerformers.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 24, fontSize: 13, fontWeight: 800, color: i < 3 ? "var(--yellow)" : "var(--text-muted)" }}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.class} · {s.rollNo}</div>
                  </div>
                  <div className="badge present" style={{ fontWeight: 700 }}>{s.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
            <div className="card-title">Attendance Risk Report (&lt;75%)</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Attendance Rate</th>
                <th>Total Sessions</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong><br/><small className="text-muted">{s.rollNo}</small></td>
                  <td>{s.class} Engineering</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-wrap" style={{ flex: 1, height: 6 }}><div className="progress-bar red" style={{ width: `${s.percentage}%` }} /></div>
                        <span style={{ color: "var(--red)", fontWeight: 700 }}>{s.percentage}%</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>Marked in {s.totalSessions} days</td>
                </tr>
              ))}
            </tbody>
          </table>
          {atRiskStudents.length === 0 && <div className="empty-state"><h3>All clear!</h3><p>No students below 75%.</p></div>}
        </div>
      </div>
    </div>
  );
}


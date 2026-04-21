import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2, XCircle, Clock, Calendar, 
  BookOpen, Award, AlertTriangle, TrendingUp
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function StudentDashboard() {
  const { getAttendanceForDate } = useApp();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAttendanceForDate({}); 
      if (Array.isArray(data)) {
        const myHistory = data.map(record => {
            const myStatus = record.records.find(r => r.student?._id === user?.studentId || r.student === user?.studentId)?.status;
            return { ...record, myStatus };
        }).filter(item => item.myStatus);
        setHistory(myHistory.sort((a, b) => b.date.localeCompare(a.date)));
      }
      setLoading(false);
    }
    if (user?.studentId) load();
  }, [user]);

  const stats = {
    present: history.filter(h => h.myStatus === 'present').length,
    late: history.filter(h => h.myStatus === 'late').length,
    absent: history.filter(h => h.myStatus === 'absent').length,
    total: history.length
  };
  const percentage = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;
  
  const pieData = [
    { name: "Present", value: stats.present },
    { name: "Late", value: stats.late },
    { name: "Absent", value: stats.absent },
  ].filter(d => d.value > 0);

  return (
    <div className="page fade-in">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap indigo"><TrendingUp size={20} /></div></div>
          <div className="stat-value" style={{ color: percentage >= 75 ? "var(--green)" : "var(--red)" }}>{percentage}%</div>
          <div className="stat-label">My Attendance Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap green"><CheckCircle2 size={20} /></div></div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{stats.present}</div>
          <div className="stat-label">Days Present</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap yellow"><Clock size={20} /></div></div>
          <div className="stat-value" style={{ color: "var(--yellow)" }}>{stats.late}</div>
          <div className="stat-label">Late Arrivals</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><div className="stat-icon-wrap red"><XCircle size={20} /></div></div>
          <div className="stat-value" style={{ color: "var(--red)" }}>{stats.absent}</div>
          <div className="stat-label">Days Absent</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <div className="card">
            <div className="card-header"><div className="card-title">Attendance Ratio</div></div>
            <div className="card-body" style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stats.total > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-muted">No attendance data recorded yet.</p>
                )}
            </div>
        </div>

        <div className="card">
            <div className="card-header"><div className="card-title">Recent Activity</div></div>
            <div className="card-body" style={{ padding: 0 }}>
                {history.slice(0, 5).map((item, i) => (
                    <div key={i} style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.course?.name || "Subject"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{new Date(item.date).toLocaleDateString()}</div>
                        </div>
                        <span className={`badge ${item.myStatus}`} style={{ padding: "4px 10px", fontSize: 11 }}>
                            {item.myStatus.toUpperCase()}
                        </span>
                    </div>
                ))}
                {history.length === 0 && <div style={{ padding: 40, textAlign: "center" }}>No activity logs yet.</div>}
            </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, XCircle, Clock, Calendar, BookOpen, Filter } from "lucide-react";

const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export default function StudentAttendance() {
  const { getAttendanceForDate, courses } = useApp();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("All");

  useEffect(() => {
    async function load() {
      setLoading(true);
      // For now, get all attendance and filter locally (production should filter on DB)
      const data = await getAttendanceForDate({}); // Fetching all
      if (Array.isArray(data)) {
        // Find records where this student is present
        const myHistory = data.map(record => {
            const myStatus = record.records.find(r => r.student?._id === user?.studentId || r.student === user?.studentId)?.status;
            return {
                ...record,
                myStatus
            };
        }).filter(item => item.myStatus); // Only items where I have a status
        
        setHistory(myHistory.sort((a, b) => b.date.localeCompare(a.date)));
      }
      setLoading(false);
    }
    if (user?.studentId) load();
  }, [user]);

  const filteredHistory = history.filter(h => 
    filterCourse === "All" || h.course?._id === filterCourse || h.course === filterCourse
  );

  const stats = {
    total: filteredHistory.length,
    present: filteredHistory.filter(h => h.myStatus === 'present').length,
    late: filteredHistory.filter(h => h.myStatus === 'late').length,
    absent: filteredHistory.filter(h => h.myStatus === 'absent').length
  };
  const percentage = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

  return (
    <div className="page fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        
        <div>
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Filter size={16} className="text-muted" />
                <select 
                  className="form-select" 
                  style={{ width: 200 }} 
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                >
                  <option value="All">All Subjects</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
                <div className="card-title">Attendance Timeline</div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-wrap">
                {loading ? (
                    <div style={{ padding: 40, textAlign: "center" }}>Loading your records...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Faculty</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{fmtDate(item.date)}</td>
                                    <td>
                                        <div style={{ fontSize: 13, fontWeight: 700 }}>{item.course?.name || "Subject"}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.course?.code}</div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>Faculty</td> {/* Could populate faculty if needed */}
                                    <td>
                                        <span className={`badge ${item.myStatus}`}>
                                            {item.myStatus === 'present' && <CheckCircle2 size={12} />}
                                            {item.myStatus === 'absent' && <XCircle size={12} />}
                                            {item.myStatus === 'late' && <Clock size={12} />}
                                            {item.myStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filteredHistory.length === 0 && (
                    <div style={{ padding: 40, textAlign: "center" }}>No attendance records found for this selection.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>OVERALL ATTENDANCE</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: percentage >= 75 ? "var(--green)" : "var(--red)" }}>
                    {percentage}%
                </div>
                <div className="progress-wrap" style={{ height: 6, margin: "16px 0" }}>
                    <div className={`progress-bar ${percentage >= 75 ? 'green' : 'red'}`} style={{ width: `${percentage}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {percentage >= 75 ? "Great job! You satisfy the minimum 75% criteria." : "Warning: Your attendance is below 75%."}
                </p>
            </div>

            <div className="card">
                <div className="card-header"><div className="card-title">Quick Stats</div></div>
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Total Sessions</span>
                        <strong>{stats.total}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--green)" }}>Present</span>
                        <strong>{stats.present}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--yellow)" }}>Late</span>
                        <strong>{stats.late}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--red)" }}>Absent</span>
                        <strong>{stats.absent}</strong>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

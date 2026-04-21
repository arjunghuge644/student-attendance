import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, XCircle, Clock, Minus, Search, Calendar, ChevronRight, BookOpen, UserCheck } from "lucide-react";

const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export default function History() {
  const { getAttendanceForDate, courses } = useApp();
  const [allRecords, setAllRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAttendanceForDate({}); // Fetch all
      if (Array.isArray(data)) {
        setAllRecords(data);
        if (data.length > 0) setExpandedDate(data[0].date);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Group by date
  const grouped = allRecords.reduce((acc, rec) => {
    if (!acc[rec.date]) acc[rec.date] = [];
    acc[rec.date].push(rec);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="page fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 24 }}>
        
        {/* Left: Date Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}><Calendar size={14} /> ATTENDANCE LOGS</h3>
          {dates.map((date) => (
            <div 
              key={date} 
              className={`card ${expandedDate === date ? "glow-indigo" : ""}`}
              style={{ cursor: "pointer", borderColor: expandedDate === date ? "var(--accent)" : "var(--border)" }}
              onClick={() => setExpandedDate(date)}
            >
              <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtDate(date)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{grouped[date].length} sessions conducted</div>
                </div>
                <ChevronRight size={18} opacity={expandedDate === date ? 1 : 0.3} />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed View */}
        <div>
          {expandedDate ? (
            <div className="slide-up">
              <div className="card-header" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20 }}>Logs for {fmtDate(expandedDate)}</h2>
              </div>
              
              {grouped[expandedDate].map((session, idx) => (
                <div key={idx} className="card" style={{ marginBottom: 20 }}>
                  <div className="card-header" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <BookOpen size={16} className="text-secondary" />
                        <strong>{session.course?.name} ({session.course?.code})</strong>
                    </div>
                    <span className="info-chip">{session.class} · Section {session.section}</span>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                            <th>Student</th>
                            <th>Roll No</th>
                            <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.records.map((r, i) => (
                          <tr key={i}>
                            <td><strong>{r.student?.name || "Student"}</strong></td>
                            <td>{r.student?.rollNo || "N/A"}</td>
                            <td>
                                <span className={`badge ${r.status}`}>
                                    {r.status === 'present' && <UserCheck size={12} />}
                                    {r.status.toUpperCase()}
                                </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Select a date to view detailed records.</div>
          )}
        </div>

      </div>
    </div>
  );
}


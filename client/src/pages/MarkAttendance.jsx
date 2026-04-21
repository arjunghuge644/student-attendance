import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Save, CheckCircle2, ChevronLeft, ChevronRight, Users, BookOpen } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];

export default function MarkAttendance() {
  const { students, courses, saveAttendance, getAttendanceForDate } = useApp();
  const { user } = useAuth();
  const [date, setDate] = useState(today());
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [records, setRecords] = useState({});
  const [filterSection, setFilterSection] = useState("All");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Faculty's assigned courses
  // Map against global courses list in case user.courses contains only IDs
  const myCourses = user?.role === 'admin' 
    ? courses 
    : (user?.courses || []).map(c => {
        if (typeof c === 'string') return courses.find(gc => gc._id === c);
        if (c._id) return courses.find(gc => gc._id === c._id) || c;
        return c;
      }).filter(Boolean);

  const selectedCourse = myCourses.find(c => (c._id || c.id) === selectedCourseId);


  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(myCourses[0]._id || myCourses[0].id);
    }
  }, [myCourses, selectedCourseId]);

  useEffect(() => {
    async function load() {
      if (!selectedCourseId) return;
      setLoading(true);
      const data = await getAttendanceForDate({ 
        date, 
        courseId: selectedCourseId, 
        class: selectedCourse?.targetClass, 
        section: filterSection 
      });

      if (data && data.records && data.records.length > 0) {
        const init = {};
        data.records.forEach(r => { 
          if (r.student) init[r.student._id || r.student] = r.status; 
        });
        setRecords(init);
      } else {
        const init = {};
        filteredStudents.forEach((s) => { init[s._id || s.id] = "present"; });
        setRecords(init);
      }
      setLoading(false);
      setSaved(false);
    }
    load();
  }, [date, selectedCourseId, filterSection]);

  const changeDate = (delta) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
    if (!selectedCourseId) return;
    const formattedRecords = Object.entries(records).map(([studentId, status]) => ({
      student: studentId,
      status
    }));
    
    const ok = await saveAttendance({
      date,
      courseId: selectedCourseId,
      class: selectedCourse?.targetClass,
      section: filterSection === 'All' ? 'A' : filterSection,
      records: formattedRecords
    });

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchClass = selectedCourse ? s.class === selectedCourse.targetClass : true;
    const matchSection = filterSection === "All" || s.section === filterSection;
    return matchClass && matchSection;
  });

  const sections = ["All", ...new Set(students.filter(s => s.class === selectedCourse?.targetClass).map(s => s.section))];

  return (
    <div className="page fade-in">
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-secondary btn-icon" onClick={() => changeDate(-1)}><ChevronLeft size={18} /></button>
                <input type="date" className="form-input" value={date} max={today()} onChange={(e) => setDate(e.target.value)} style={{ width: 150 }} />
                <button className="btn btn-secondary btn-icon" onClick={() => changeDate(1)} disabled={date >= today()}><ChevronRight size={18} /></button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={18} className="text-muted" />
                <select 
                  className="form-select" 
                  style={{ width: 220 }} 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="" disabled>Select Course</option>
                  {myCourses.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.code}: {c.name} ({c.targetClass})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <select className="form-select" style={{ width: "auto" }} value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
                {sections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Sec ${s}`}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="att-summary-chips">
          <span className="info-chip"><Users size={13} /> {filteredStudents.length} Students in {selectedCourse?.targetClass}</span>
          {selectedCourse && <span className="badge present">Course: {selectedCourse.code}</span>}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const upd = {};
            filteredStudents.forEach(s => upd[s._id || s.id] = "present");
            setRecords(upd);
          }}>
            Select All Present
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const upd = {};
            filteredStudents.forEach(s => upd[s._id || s.id] = "absent");
            setRecords(upd);
          }}>
            Select All Absent
          </button>
          
          <div style={{ width: 1, backgroundColor: "var(--border)", height: 32, margin: "0 8px" }} />
          
          <button 
            className={`btn ${saved ? "btn-secondary" : "btn-primary"}`} 
            onClick={handleSave} 
            disabled={!selectedCourseId || loading || filteredStudents.length === 0}
            style={{ minWidth: 160 }}
          >
            {saved ? (
              <><CheckCircle2 size={16} /> Saved Successfully</>
            ) : loading ? (
              "Saving..."
            ) : (
              <><Save size={16} /> Save Attendance</>
            )}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}><p>Loading...</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Section</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s._id || s.id}>
                    <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{i + 1}</td>
                    <td><div className="td-student"><strong>{s.name}</strong></div></td>
                    <td style={{ color: "var(--text-secondary)" }}>{s.rollNo}</td>
                    <td><span className="info-chip">{s.section}</span></td>
                    <td>
                      <div className="attendance-toggle">
                        {["present", "absent", "late"].map((status) => (
                          <button 
                            key={status} 
                            className={`att-btn ${records[s._id || s.id] === status ? `active-${status}` : ""}`}
                            onClick={() => setRecords(p => ({ ...p, [s._id || s.id]: status }))}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filteredStudents.length === 0 && (
          <div className="empty-state">
            <h3>No students found</h3>
            <p>Check if students are registered for {selectedCourse?.targetClass}</p>
          </div>
        )}
      </div>
    </div>
  );
}

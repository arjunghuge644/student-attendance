import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CLASS_OPTIONS, DIVISION_OPTIONS } from "../data/initialData";
import { Plus, Search, Trash2, X, UserPlus, Filter, UserX, CheckCircle2 } from "lucide-react";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#3b82f6,#2563eb)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ef4444,#dc2626)",
];

const getColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", rollNo: "", class: "FY", section: "A" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rollNo.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Registration: New Student</span>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Rahul Sharma" value={form.name} autoFocus
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input className="form-input" placeholder="e.g. A007" value={form.rollNo}
                onChange={(e) => setForm((p) => ({ ...p, rollNo: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Class Year</label>
                <select className="form-select" value={form.class}
                  onChange={(e) => setForm((p) => ({ ...p, class: e.target.value }))}>
                  {CLASS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Division</label>
                <select className="form-select" value={form.section}
                  onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}>
                  {DIVISION_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><UserPlus size={16} /> Register Student</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Students() {
  const { students, addStudent, deleteStudent, getStudentStats } = useApp();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All" || s.class === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="page fade-in">
      {/* ── Summary Cards per Class ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
        {["All", "FY", "SE", "TE", "BE"].map(cls => (
          <div
            key={cls}
            className={`card ${filterClass === cls ? "glow-indigo" : ""}`}
            style={{
              padding: "16px 20px", cursor: "pointer", transition: "0.2s",
              borderColor: filterClass === cls ? "var(--accent)" : "var(--border)",
              background: filterClass === cls ? "var(--accent-soft)" : "var(--bg-card)"
            }}
            onClick={() => setFilterClass(cls)}
          >
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{cls} Students</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {cls === "All" ? students.length : students.filter(s => s.class === cls).length}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-left" style={{ flex: 1 }}>
          <div className="search-bar-wrap" style={{ flex: 1, maxWidth: 400 }}>
            <Search size={16} />
            <input className="search-input" style={{ width: "100%" }} placeholder="Search name or ID..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="info-chip">
            <Filter size={14} /> {filterClass} Filter Active
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Class & Div</th>
              <th>Overall Attendance</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => {
              const stats = getStudentStats(student.id);
              return (
                <tr key={student.id}>
                  <td>
                    <div className="td-student">
                      <div className="avatar avatar-gradient" style={{ width: 34, height: 34, background: getColor(student.id) }}>{student.avatar}</div>
                      <div className="td-student-info">
                        <strong>{student.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>{student.rollNo}</td>
                  <td>
                    <span className="info-chip" style={{ fontSize: 11 }}>{student.class} · {student.section}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="progress-wrap" style={{ flex: 1, height: 6, maxWidth: 100 }}>
                        <div className={`progress-bar ${stats.percentage >= 75 ? "green" : "red"}`} style={{ width: `${stats.percentage}%` }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: stats.percentage >= 75 ? "var(--green)" : "var(--red)" }}>{stats.percentage}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteConfirm(student.id)}
                      style={{ padding: "6px 10px" }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: "80px 20px" }}>
            <div className="empty-state-icon">👥</div>
            <h3>No students in this view</h3>
            <p>Adjust your filters or add a new student to this class.</p>
          </div>
        )}
      </div>

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdd={addStudent} />}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal slide-up" style={{ width: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: "none" }}>
              <div className="stat-icon-wrap red" style={{ width: 44, height: 44, marginBottom: 0 }}><UserX size={20} /></div>
              <button className="modal-close-btn" onClick={() => setDeleteConfirm(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", paddingTop: 0 }}>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>Remove Student?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{students.find(s => s.id === deleteConfirm)?.name}</strong>?
                This action cannot be undone and all history will be lost.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: "none", justifyContent: "center", paddingBottom: 24 }}>
              <button className="btn btn-secondary" style={{ padding: "10px 24px" }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ padding: "10px 24px" }} onClick={() => { deleteStudent(deleteConfirm); setDeleteConfirm(null); }}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

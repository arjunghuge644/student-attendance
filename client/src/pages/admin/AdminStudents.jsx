import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CLASS_OPTIONS, DIVISION_OPTIONS } from "../../data/initialData";
import { Plus, Search, Trash2, X, UserPlus, Filter, UserX, Mail } from "lucide-react";

function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", rollNo: "", class: "FY", section: "A" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.rollNo.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Register: New Student</span>
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
              <label className="form-label">Email Address (for Login)</label>
              <input className="form-input" type="email" placeholder="student@moderncoe.edu.in" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
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

export default function AdminStudents() {
  const { students, addStudent, deleteStudent } = useApp();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                       s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                       s.email?.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All" || s.class === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="page fade-in">
      <div className="toolbar">
        <div className="toolbar-left" style={{ flex: 1 }}>
          <div className="search-bar-wrap" style={{ flex: 1, maxWidth: 400 }}>
            <Search size={16} />
            <input className="search-input" style={{ width: "100%" }} placeholder="Search name, ID or email..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 120 }} value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            {["All", "FY", "SE", "TE", "BE"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Register Student
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Student Management</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email & Roll</th>
                  <th>Class & Div</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>
                      <div className="td-student">
                        <div className="avatar avatar-gradient" style={{ width: 34, height: 34 }}>{s.name[0]}</div>
                        <strong>{s.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Mail size={12} /> {s.email}</div>
                        <div style={{ marginTop: 2, fontWeight: 600 }}>ID: {s.rollNo}</div>
                      </div>
                    </td>
                    <td>
                      <span className="info-chip" style={{ fontSize: 11 }}>{s.class} · Div {s.section}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-icon btn-danger" onClick={() => setDeleteConfirm(s)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdd={addStudent} />}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal slide-up" style={{ width: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Confirm Deletion</span>
              <button className="modal-close-btn" onClick={() => setDeleteConfirm(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <div className="stat-icon-wrap red" style={{ margin: "0 auto 16px" }}><UserX size={24} /></div>
              <h3>Remove {deleteConfirm.name}?</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 8 }}>All attendance logs for this student will be permanently deleted.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { deleteStudent(deleteConfirm._id || deleteConfirm.id); setDeleteConfirm(null); }}>
                Remove Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

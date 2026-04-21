import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Briefcase, Plus, Trash2, Search, Mail, X, Check, BookOpen } from "lucide-react";

function RegisterFacultyModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", designation: "Assistant Professor", department: "Computer Science" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onAdd(form);
    onClose();
  };

  const depts = ["Computer Science", "IT", "Mechanical", "E&TC", "Civil"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Register Faculty Member</span>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Dr. Jane Doe" value={form.name} autoFocus
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="faculty@moderncoe.edu.in" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input className="form-input" placeholder="e.g. Professor" value={form.designation}
                    onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}>
                    {depts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Plus size={16} /> Register Faculty</button>
          </div>
        </form>
      </div>
    </div>
  );
}


function AssignCoursesModal({ faculty, allCourses, onClose, onAssign }) {
  const [selected, setSelected] = useState(faculty.courses?.map(c => c._id) || []);

  const toggleCourse = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar avatar-gradient" style={{ width: 32, height: 32 }}>{faculty.name[0]}</div>
            <span className="modal-title">Manage Assignments</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Assign subjects for <strong>{faculty.name}</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
            {allCourses.map(c => (
              <div 
                key={c._id} 
                onClick={() => toggleCourse(c._id)}
                style={{ 
                  padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", 
                  display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                  background: selected.includes(c._id) ? "var(--accent-soft)" : "transparent",
                  borderColor: selected.includes(c._id) ? "var(--accent)" : "var(--border)"
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.code}: {c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Target: {c.targetClass} Engineering</div>
                </div>
                {selected.includes(c._id) && <Check size={16} color="var(--accent-light)" />}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onAssign(faculty._id, selected); onClose(); }}>Update Assignments</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFaculty() {
  const { faculty, courses, registerFaculty, deleteUser, assignCoursesToFaculty } = useApp();
  const [search, setSearch] = useState("");
  const [showRegModal, setShowRegModal] = useState(false);
  const [assignModalData, setAssignModalData] = useState(null);

  const filtered = faculty.filter((f) => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-in">
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-bar-wrap">
            <Search size={16} />
            <input type="text" placeholder="Search faculty name or email..." className="search-input" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowRegModal(true)}>
            <Plus size={18} />
            Register Faculty
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Faculty Directory</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Faculty Member</th>
                  <th>Contact Email</th>
                  <th>Subject Assignments</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <div className="td-student">
                        <div className="avatar avatar-gradient" style={{ width: 34, height: 34 }}>{f.name[0]}</div>
                        <strong>{f.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Mail size={13} /> {f.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {f.courses?.map(c => (
                          <span key={c._id} className="badge present" style={{ fontSize: 10 }}>{c.code}</span>
                        ))}
                        <button 
                          className="att-btn" 
                          style={{ padding: "2px 8px", fontSize: 10, borderRadius: 20 }}
                          onClick={() => setAssignModalData(f)}
                        >
                          <BookOpen size={10} style={{ marginRight: 4 }} /> Manage
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-icon btn-danger" onClick={() => deleteUser(f._id)} style={{ padding: 6 }}>
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

      {showRegModal && <RegisterFacultyModal onClose={() => setShowRegModal(false)} onAdd={registerFaculty} />}
      {assignModalData && (
        <AssignCoursesModal 
          faculty={assignModalData} 
          allCourses={courses} 
          onClose={() => setAssignModalData(null)} 
          onAssign={assignCoursesToFaculty} 
        />
      )}
    </div>
  );
}


import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CLASS_OPTIONS } from "../../data/initialData";
import { BookOpen, Plus, Trash2, Search, X } from "lucide-react";

function AddCourseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", code: "", targetClass: "FY" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">New Course Entry</span>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Course Name</label>
              <input className="form-input" placeholder="e.g. Operating Systems" value={form.name} autoFocus
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input className="form-input" placeholder="e.g. CS302" value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target Class</label>
              <select className="form-select" value={form.targetClass}
                onChange={(e) => setForm((p) => ({ ...p, targetClass: e.target.value }))}>
                {CLASS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Plus size={16} /> Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const { courses, addCourse, deleteCourse } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = courses.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-in">
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-bar-wrap">
            <Search size={16} />
            <input type="text" placeholder="Search courses..." className="search-input" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add New Course
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Course Management</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Target Class</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course._id}>
                    <td style={{ fontWeight: 700, color: "var(--accent)", letterSpacing: "0.5px" }}>{course.code}</td>
                    <td>{course.name}</td>
                    <td><span className="info-chip" style={{ fontSize: 11 }}>{course.targetClass}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-icon btn-danger" onClick={() => deleteCourse(course._id)} style={{ padding: 6 }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
               <div className="empty-state">
                 <div className="empty-state-icon">📚</div>
                 <h3>No courses found</h3>
                 <p>Try searching for a different name or add a new course.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <AddCourseModal onClose={() => setShowModal(false)} onAdd={addCourse} />}
    </div>
  );
}


import React from "react";
import { Calendar } from "lucide-react";

const pageMeta = {
  dashboard: { title: "Dashboard", desc: "Overview of attendance activity" },
  students: { title: "Students", desc: "Manage all enrolled students" },
  attendance: { title: "Mark Attendance", desc: "Record today's attendance" },
  history: { title: "Attendance History", desc: "View past attendance records" },
  reports: { title: "Reports & Analytics", desc: "Detailed attendance insights" },
  courses: { title: "Undergraduate Courses", desc: "Manage curriculum and year-wise subjects" },
  faculty: { title: "Faculty Directory", desc: "Manage staff and subject assignments" },
};

export default function Header({ page }) {
  const meta = pageMeta[page] || { title: "AttendX", desc: "" };
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </div>
      <div className="topbar-right">
        <div className="topbar-date">
          <Calendar size={14} />
          {today}
        </div>
      </div>
    </div>
  );
}

export const CLASS_OPTIONS = ["FY", "SE", "TE", "BE"];
export const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export const initialStudents = [
  { id: 1,  name: "Aarav Sharma",   rollNo: "FY-A001", class: "FY", section: "A", avatar: "AS" },
  { id: 2,  name: "Priya Patel",    rollNo: "FY-A002", class: "FY", section: "A", avatar: "PP" },
  { id: 3,  name: "Rohan Gupta",    rollNo: "FY-A003", class: "FY", section: "A", avatar: "RG" },
  { id: 4,  name: "Sneha Verma",    rollNo: "FY-B001", class: "FY", section: "B", avatar: "SV" },
  { id: 5,  name: "Karan Singh",    rollNo: "SE-A001", class: "SE", section: "A", avatar: "KS" },
  { id: 6,  name: "Ananya Rao",     rollNo: "SE-A002", class: "SE", section: "A", avatar: "AR" },
  { id: 7,  name: "Vikram Kumar",   rollNo: "SE-B001", class: "SE", section: "B", avatar: "VK" },
  { id: 8,  name: "Meera Joshi",    rollNo: "TE-A001", class: "TE", section: "A", avatar: "MJ" },
  { id: 9,  name: "Rohit Mehta",    rollNo: "TE-A002", class: "TE", section: "A", avatar: "RM" },
  { id: 10, name: "Divya Nair",     rollNo: "TE-B001", class: "TE", section: "B", avatar: "DN" },
  { id: 11, name: "Arjun Khanna",   rollNo: "BE-A001", class: "BE", section: "A", avatar: "AK" },
  { id: 12, name: "Pooja Chauhan",  rollNo: "BE-A002", class: "BE", section: "A", avatar: "PC" },
];

const today = new Date();
const fmtDate = (d) => d.toISOString().split("T")[0];

const genDate = (daysAgo) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return fmtDate(d);
};

const statuses = ["present", "present", "present", "present", "absent", "late"];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const initialAttendance = {};

for (let day = 0; day < 14; day++) {
  const date = genDate(day);
  initialAttendance[date] = {};
  initialStudents.forEach((s) => {
    initialAttendance[date][s.id] = rand(statuses);
  });
}

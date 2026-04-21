import express from 'express';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { verifyAdmin, verifyFaculty } from '../middleware/auth.js';

const router = express.Router();

// Get system overview
router.get('/stats', verifyFaculty, async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        
        // Count unique courses that have attendance records
        const activeCourses = await Attendance.distinct('course');
        
        const recentAttendance = await Attendance.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('course');
        
        res.json({
            studentCount,
            facultyCount,
            courseCount: activeCourses.length,
            recentAttendance
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all faculty members
router.get('/faculty', verifyAdmin, async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).populate('courses');
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register a new faculty member (or student)
router.post('/users', verifyAdmin, async (req, res) => {
    const { email, name, role, courses, designation, department } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already registered" });

        const newUser = await User.create({
            email,
            name,
            role: role || 'faculty',
            courses: courses || [],
            designation,
            department,
            googleId: `pre-${Date.now()}` // Temporary ID until first login
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign courses to faculty
router.put('/faculty/:id/courses', verifyAdmin, async (req, res) => {
    const { courses } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { courses },
            { new: true }
        ).populate('courses');
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get detailed reports
router.get('/reports', verifyFaculty, async (req, res) => {
    try {
        const classes = ["FY", "SE", "TE", "BE"];
        const report = {
            classAverages: [],
            topPerformers: [],
            atRiskStudents: []
        };

        // Aggregation to find per-student attendance stats
        const studentStats = await Attendance.aggregate([
            { $unwind: "$records" },
            { $group: {
                _id: "$records.student",
                total: { $sum: 1 },
                present: { $sum: { $cond: [{ $in: ["$records.status", ["present", "late"]] }, 1, 0] } }
            }},
            { $project: {
                percentage: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }
            }}
        ]);

        // Map stats to real student names and classes
        const studentsWithStats = await Student.find();
        const mapped = studentsWithStats.map(s => {
            const stat = studentStats.find(st => st._id.toString() === s._id.toString());
            return {
                _id: s._id,
                name: s.name,
                rollNo: s.rollNo,
                class: s.class,
                percentage: stat ? stat.percentage : 0,
                totalSessions: stat ? stat.total : 0
            };
        });

        // Class Averages
        report.classAverages = classes.map(cls => {
            const clsStudents = mapped.filter(s => s.class === cls);
            const avg = clsStudents.length > 0
                ? clsStudents.reduce((acc, s) => acc + s.percentage, 0) / clsStudents.length
                : 0;
            return { name: cls, rate: Math.round(avg) };
        });

        // Top 10
        report.topPerformers = [...mapped].sort((a, b) => b.percentage - a.percentage).slice(0, 10);

        // At Risk (< 75%)
        report.atRiskStudents = mapped.filter(s => s.percentage < 75 && s.totalSessions > 0)
                                      .sort((a, b) => a.percentage - b.percentage);

        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

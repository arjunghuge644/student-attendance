import express from 'express';
import Attendance from '../models/Attendance.js';
import { verifyFaculty, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get attendance for a specific course, date, class, and section
router.get('/', verifyToken, async (req, res) => {
    const { date, courseId, class: className, section } = req.query;
    try {
        let query = {};
        if (date) query.date = date;
        if (courseId) query.course = courseId;
        if (className) query.class = className;
        if (section && section !== 'All') query.section = section;
        
        if (req.user.role === 'student' && req.user.studentId) {
             // For students viewing their own attendance history
             const attendances = await Attendance.find(query).populate('course').populate('records.student');
             return res.json(attendances);
        }

        // If all filters are provided, it's likely a specific session for "Mark Attendance"
        if (date && courseId && className && section) {
            const attendance = await Attendance.findOne({ 
                date, 
                course: courseId, 
                class: className, 
                section 
            }).populate('course').populate('records.student');
            return res.json(attendance || { date, records: [] });
        }

        // Otherwise return all matching records for History/Reports
        const records = await Attendance.find(query)
            .sort({ date: -1 })
            .populate('course')
            .populate('records.student');
        res.json(records);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save/Update attendance
router.post('/', verifyFaculty, async (req, res) => {
    const { date, courseId, class: className, section, records } = req.body;
    try {
        let attendance = await Attendance.findOne({ 
            date, course: courseId, class: className, section 
        });
        if (attendance) {
            attendance.records = records;
            await attendance.save();
        } else {
            attendance = await Attendance.create({ 
                date, course: courseId, class: className, section, records 
            });
        }
        res.status(201).json(attendance);
    } catch (err) {
        console.error('Attendance Save Error:', err);
        res.status(400).json({ message: err.message });
    }
});

export default router;

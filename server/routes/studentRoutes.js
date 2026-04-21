import express from 'express';
import Student from '../models/Student.js';
import { verifyToken, verifyFaculty } from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', verifyToken, async (req, res) => {
    try {
        const { class: cls, section } = req.query;
        const filter = {};
        if (cls && cls !== 'All') filter.class = cls;
        if (section && section !== 'All') filter.section = section;
        
        const students = await Student.find(filter).sort({ rollNo: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a student (Faculty/Admin only)
router.post('/', verifyFaculty, async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student (Faculty/Admin only)
router.delete('/:id', verifyFaculty, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;

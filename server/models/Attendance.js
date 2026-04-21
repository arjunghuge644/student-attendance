import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    records: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['present', 'absent', 'late'], required: true }
    }]
}, { timestamps: true });

// Ensure one attendance per date, course, class, and section
attendanceSchema.index({ date: 1, course: 1, class: 1, section: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;

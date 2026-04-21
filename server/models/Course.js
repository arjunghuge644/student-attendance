import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    targetClass: { type: String, required: true }, // e.g., 'FY', 'SE', 'TE', 'BE'
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;

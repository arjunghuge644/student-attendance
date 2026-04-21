import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    avatar: { type: String },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;

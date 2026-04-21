import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'faculty' },
    picture: { type: String },
    googleId: { type: String, required: true, unique: true },
    designation: { type: String }, // For faculty
    department: { type: String }, // For faculty
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // For students
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

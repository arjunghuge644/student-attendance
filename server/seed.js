import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from './models/Student.js';
import Course from './models/Course.js';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });


const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Seed Courses
        const coursesCount = await Course.countDocuments();
        if (coursesCount === 0) {
            console.log("Seeding courses...");
            await Course.insertMany([
                { name: "Engineering Mathematics-I", code: "MTH101", targetClass: "FY" },
                { name: "Data Structures & Algorithms", code: "CS201", targetClass: "SE" },
                { name: "Theory of Computation", code: "CS301", targetClass: "TE" },
                { name: "Cloud Computing", code: "CS401", targetClass: "BE" }
            ]);
        }

        // Seed Students
        const studentCount = await Student.countDocuments();
        if (studentCount === 0) {
            console.log("Seeding students...");
            const students = [];
            for (let i = 1; i <= 20; i++) {
                students.push({
                    name: `Student ${i}`,
                    rollNo: `FY${1000 + i}`,
                    email: `fy_student${i}@moderncoe.edu.in`,
                    class: "FY",
                    section: "A"
                });
            }
            for (let i = 1; i <= 15; i++) {
                students.push({
                    name: `Student ${i + 20}`,
                    rollNo: `SE${2000 + i}`,
                    email: `se_student${i}@moderncoe.edu.in`,
                    class: "SE",
                    section: "B"
                });
            }
            await Student.insertMany(students);
        }

        // Seed Faculty User
        const facultyEmail = 'faculty@moderncoe.edu.in';
        let facultyUser = await User.findOne({ email: facultyEmail });
        const dsCourse = await Course.findOne({ code: 'CS201' });
        const tocCourse = await Course.findOne({ code: 'CS301' });

        if (!facultyUser) {
            console.log(`Seeding Faculty User: ${facultyEmail}`);
            facultyUser = await User.create({
                name: "Dr. Faculty Name",
                email: facultyEmail,
                role: "faculty",
                googleId: "initial-faculty-id",
                designation: "Associate Professor",
                department: "Computer Science",
                courses: [dsCourse._id, tocCourse._id]
            });
        } else {
            // Ensure they have courses assigned even if they exist
            facultyUser.courses = [dsCourse._id, tocCourse._id];
            await facultyUser.save();
        }

        // Seed Admin User (if not exists)


        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();

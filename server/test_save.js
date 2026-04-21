import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './models/Attendance.js';

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const date = '2026-04-21';
        const courseId = '69e7ca05345e974ff47465c1'; // from logs
        const className = 'TE';
        const section = 'A';
        const records = [
            { student: '69e7ca05345e974ff47465c2', status: 'present' } // fake student ID
        ];

        let attendance = await Attendance.findOne({ 
            date, course: courseId, class: className, section 
        });
        
        console.log("Found:", attendance);

        if (attendance) {
            attendance.records = records;
            await attendance.save();
            console.log("Saved existing");
        } else {
            attendance = await Attendance.create({ 
                date, course: courseId, class: className, section, records 
            });
            console.log("Created new");
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

test();

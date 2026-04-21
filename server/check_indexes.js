import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './models/Attendance.js';

dotenv.config();

async function fixIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const indexes = await Attendance.collection.indexes();
        console.log('Current indexes:', indexes);

        try {
            await Attendance.collection.dropIndex('date_1');
            console.log('Dropped date_1 index');
        } catch (e) {
            console.log('Index date_1 not found or could not be dropped', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixIndexes();

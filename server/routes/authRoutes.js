import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // Check domain
        const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || 'moderncoe.edu.in';
        if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            return res.status(403).json({ message: `Access denied. Only @${ALLOWED_DOMAIN} accounts allowed.` });
        }

        const isAdmin = email === process.env.ADMIN_EMAIL;
        
        let userRole = null;
        let dbStudent = null;

        if (isAdmin) {
            userRole = 'admin';
        } else {
            // Check if user is a pre-registered faculty
            const preUser = await User.findOne({ email });
            if (preUser && preUser.role === 'faculty') {
                userRole = 'faculty';
            } else {
                // Check if user is a pre-registered student
                dbStudent = await Student.findOne({ email });
                if (dbStudent) {
                    userRole = 'student';
                }
            }
        }

        if (!userRole) {
            return res.status(403).json({ message: "Access denied. Your email is not registered in the system as Faculty or Student." });
        }

        // Upsert User record
        let user = await User.findOne({ email }).populate('courses');
        
        if (!user) {
            user = await User.create({
                googleId: sub,
                email,
                name,
                picture,
                role: userRole
            });
            // Re-fetch to satisfy potential post-create needs (though courses will be empty)
            user = await user.populate('courses');
        } else {
            // Update existing user with Google info if necessary
            let needsSave = false;
            if (!user.googleId) { user.googleId = sub; needsSave = true; }
            if (user.role !== userRole) { user.role = userRole; needsSave = true; }
            if (user.name !== name) { user.name = name; needsSave = true; }
            if (user.picture !== picture) { user.picture = picture; needsSave = true; }
            if (needsSave) await user.save();
        }


        // Generate JWT token
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role, email: user.email, studentId: dbStudent ? dbStudent._id : null },
            process.env.JWT_SECRET || 'modern_coe_secret_fallback',
            { expiresIn: '24h' }
        );

        res.status(200).json({ user, token: jwtToken });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token', error: err.message });
    }
});

router.post('/guest', async (req, res) => {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({message: "Not allowed"});
    const { role } = req.body;
    const email = role === 'faculty' ? 'faculty@moderncoe.edu.in' : 'admin@moderncoe.edu.in';
    
    try {
        const user = await User.findOne({ email }).populate('courses');
        if (!user) return res.status(404).json({message: "Guest user not found in DB. Run the seed script."});
        
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'modern_coe_secret_fallback',
            { expiresIn: '24h' }
        );
        res.json({ user, token: jwtToken });
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});


router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('courses');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

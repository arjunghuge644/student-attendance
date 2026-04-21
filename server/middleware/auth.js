import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "No token provided" });

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'modern_coe_secret_fallback');

        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Admin access only" });
        }
    });
};

export const verifyFaculty = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'faculty' || req.user?.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Faculty access required" });
        }
    });
};

export const verifyStudent = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'student' || req.user?.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Student access required" });
        }
    });
};

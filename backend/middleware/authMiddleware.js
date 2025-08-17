import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify user is authenticated
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Invalid token" });

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware to verify user is an admin
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

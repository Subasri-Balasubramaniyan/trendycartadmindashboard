// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'customer') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

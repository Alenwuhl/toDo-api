import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Denegated access, token is required' });
  }

  //add the user to the req
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

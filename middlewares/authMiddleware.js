import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import logger from "./logger.js"; 

export const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    logger.warn("Unauthorized access attempt - No token provided");
    return res.status(401).json({ message: 'Denegated access, token is required' });
  }

  //add the user to the req
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select('-password');
    logger.info(`Token verified for user ID: ${req.user.id}`);
    next();
  } catch (error) {
    logger.error(`Invalid token - ${error.message}`);
    res.status(401).json({ message: 'Invalid token' });
  }
};

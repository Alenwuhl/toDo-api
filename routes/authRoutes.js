import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // Register
router.post('/login', loginUser);       // Login
export default router;

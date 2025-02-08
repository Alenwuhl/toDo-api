import * as authService from "../services/authService.js";
import logger from "../middlewares/logger.js";

// register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginResponse = await authService.loginUser(email, password);
    res.json(loginResponse);
  } catch (error) {
    logger.error(`Error Logging in: ${error.message}`);
    res.status(500).json({ message: "Error Logging in", error: error.message });
  }
};

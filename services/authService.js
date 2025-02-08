import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import logger from "../middlewares/logger.js";

// Register
export const registerUser = async (name, email, password) => {
  try {
    if (!name || !email || !password) {
      logger.warn("Attempt to register with missing fields.");
      throw new Error("All fields are required");
    }
    if (password.length < 6) {
      logger.warn("Attempt to register with a short password.");
      throw new Error("The password must be at least 6 characters");
    }

    // Verify if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    logger.info(`New user registered: ${email}`);
    return { message: "User registered successfully" };
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with non-existing email: ${email}`);
      throw new Error("Invalid email or password");
    }

    // compare the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new Error("Invalid email or password");
    }

    // create the token 1h
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${email}`);
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  } catch (error) {
    logger.error(`Error Logging in: ${error.message}`);
    throw error;
  }
};

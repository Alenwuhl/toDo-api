import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

//register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "The password must be at least 6 characters" });
    }

    // Verify if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("📌 Password almacenada en MongoDB:", user.password);

    // compare the password
    const isMatch = await comparePassword(password, user.password);
    console.log("📌 ¿Las contraseñas coinciden?", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create the token 1h
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error Logging in", error: error.message });
  }
};

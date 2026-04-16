const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  console.log("[authController] signup - START");
  console.log("[authController] signup - Email:", req.body?.email);

  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("[authController] signup - User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    console.log("[authController] signup - User created with ID:", user._id);

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[authController] signup - ERROR:");
    console.error("[authController] signup - Error message:", error.message);
    console.error("[authController] signup - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error during signup" });
  }
};

exports.login = async (req, res) => {
  console.log("[authController] login - START");
  console.log("[authController] login - Email:", req.body?.email);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("[authController] login - Login successful for:", email);
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log("[authController] login - Invalid credentials for:", email);
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("[authController] login - ERROR:");
    console.error("[authController] login - Error message:", error.message);
    console.error("[authController] login - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error during login" });
  }
};

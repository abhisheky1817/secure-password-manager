const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email!" });
    }

    const salt = await bcrypt.genSalt(10);  
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

// LOGIN API - POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    
    res.status(200).json({
      message: "Login successful!",
      token
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//jwt token

const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // move to next step
  } catch (error) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};

// Protected route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}! You are authenticated.`,
  });
});

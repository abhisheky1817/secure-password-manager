import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'User registered successfully' });
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Guard check (MANDATORY)
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Server misconfiguration: JWT_SECRET missing',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// DASHBOARD (TEST)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}` });
});

export default router;

import express from 'express';
import CryptoJS from 'crypto-js';
import Password from '../models/Password.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ADD PASSWORD
router.post('/add', verifyToken, async (req, res) => {
  const { platform, username, password } = req.body;

  if (!platform || !username || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.CRYPTO_SECRET
  ).toString();

  await Password.create({
    userId: req.user.id,
    platform,
    username,
    password: encryptedPassword
  });

  res.status(201).json({ message: 'Password saved' });
});

// VIEW PASSWORDS
router.get('/view', verifyToken, async (req, res) => {
  const passwords = await Password.find({ userId: req.user.id });

  const decrypted = passwords.map(p => ({
    id: p._id,
    platform: p.platform,
    username: p.username,
    password: CryptoJS.AES.decrypt(
      p.password,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8)
  }));

  res.json(decrypted);
});

// DELETE PASSWORD (OWNERSHIP CHECKED)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const deleted = await Password.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!deleted) {
    return res.status(404).json({ message: 'Password not found' });
  }

  res.json({ message: 'Password deleted' });
});

export default router;

const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const Password = require('../models/Password');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};


router.post('/add', verifyToken, async (req, res) => {
  try {
    const { platform, username, password } = req.body;

    
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();

    const newPassword = new Password({
      userId: req.user.id,
      platform,
      username,
      password: encryptedPassword
    });

    await newPassword.save();
    res.status(201).json({ message: "Password saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.get('/view', verifyToken, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id });

    
    const decryptedPasswords = passwords.map(p => ({
      platform: p.platform,
      username: p.username,
      password: CryptoJS.AES.decrypt(p.password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8)
    }));

    res.status(200).json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Password deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;

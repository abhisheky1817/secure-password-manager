// backend/config/db.js

// Step 1: mongoose import karte hain
const mongoose = require('mongoose');

// Step 2: ek function banate hain jisse MongoDB connect ho
const connectDB = async () => {
  try {
    // ye line .env file ke andar MONGO_URI read karegi
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // agar error aaya toh program band kar dega
  }
};

// Step 3: function ko export karte hain taaki hum server.js me use kar sakein
module.exports = connectDB;

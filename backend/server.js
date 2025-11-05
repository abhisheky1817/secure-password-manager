
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('✅ Backend running and DB connected!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

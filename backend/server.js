const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');  
const passwordRoutes = require('./routes/passwordRoutes');
const cors = require('cors');



dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use(cors({ origin: '*'})); 



app.get('/', (req, res) => {
  res.send('✅ Backend running and DB connected!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:8080", 
  credentials: true,               
}));
app.use(express.json());

// Routes
app.get('/', (req, res)=> {
    res.json({'message':"Data API is running"});
});
app.use('/api/users', require('./routes/userRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Data Service running on port ${PORT}`));

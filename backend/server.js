const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_inventory';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🔗 Connection: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`); // Hide credentials in logs
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Make sure MongoDB is running and the connection string is correct');
  process.exit(1);
});

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


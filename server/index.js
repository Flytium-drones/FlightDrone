// server.js
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // Import admin order routes

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173/', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};


app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/payment', orderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

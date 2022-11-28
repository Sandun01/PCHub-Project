import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';

import auth from './src/routes/authRoutes.js';
import WishlistRouts from './src/routes/WishlistRouts.js';
import ProductRouts from './src/routes/ProductRoutes.js';
import OrderRouts from './src/routes/OrderRouts.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

//connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', auth);
app.use('/api/users', authRoutes);
app.use('/api/wishlists', WishlistRouts);
app.use('/api/products', ProductRouts);
app.use('/api/orders', OrderRouts);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api is working');
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

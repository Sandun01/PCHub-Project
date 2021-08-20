import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './src/routes/authRoutes.js';
import errorHandler from './src/middleware/errorMiddleware.js';
import privateRoutes from './src/routes/privateRoutes.js';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//connect to the database
connectDB();

app.use(express.json());

// Connecting Routes
app.use('/api/auth', auth);
app.use('/api/private', privateRoutes);

// Error Handler Middleware (should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api is working');
});

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});

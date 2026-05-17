import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDb from './Db/connectDB.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import settingsRoutes from './routes/settingRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

/* -------------------------- MIDDLEWARE -------------------------- */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/* ---------------------------- ROUTES ---------------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/settings', settingsRoutes);

/* ----------------------- GLOBAL ERROR HANDLER ----------------------- */

app.use(errorMiddleware);

/* --------------------------- START SERVER --------------------------- */

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
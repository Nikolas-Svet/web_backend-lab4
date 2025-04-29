// src/config/db.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lab1';

// Настройки ретраев
const MAX_RETRIES = 10;
const INITIAL_DELAY_MS = 2000;
const MAX_DELAY_MS = 30000;

/**
 * Утилита: экспоненциальная задержка с максимумом
 */
const getDelay = (attempt: number): number => {
  const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
  return Math.min(delay, MAX_DELAY_MS);
};

export const connectDB = async () => {
  let attempt = 0;

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('MongoDB connected');

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Retrying...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB error:', err);
      });

    } catch (err) {
      attempt++;
      const delay = getDelay(attempt);

      if (attempt <= MAX_RETRIES) {
        console.warn(
            `MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`
        );
        setTimeout(connectWithRetry, delay);
      } else {
        console.error('Max retries reached. MongoDB is unavailable.');
      }
    }
  };

  await connectWithRetry();
};

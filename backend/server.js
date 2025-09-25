import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();

// Security and logging
app.use(helmet());
app.use(morgan('dev'));

// CORS
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Static uploads if using local provider
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'civiclens-backend' }));
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Initialize services then start server
connectDB()
  .then(() => {
    configureCloudinary();
    app.listen(PORT, () => {
      console.log(`CivicLens backend running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Failed to connect DB', e);
    process.exit(1);
  });



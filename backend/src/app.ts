import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db';
import giveawayRoutes from './routes/giveawayRoutes';


const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/giveaway', giveawayRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Giveaway API');
});

export default app;
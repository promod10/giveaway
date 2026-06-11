import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db';
import giveawayRoutes from './routes/giveawayRoutes';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Universal Giveaway Picker API is active. Access frontend at http://localhost:5173' });
});
app.use('/api/giveaway', giveawayRoutes);

export default app;
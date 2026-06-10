import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
// import cors from 'cors';


const app = express();

// Middleware
// app.use(cors());
// app.use(express.json());

// Database Connection
// connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

export default app;
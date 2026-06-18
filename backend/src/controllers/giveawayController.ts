import { Request, Response } from 'express';
import Giveaway from '../models/giveaway';
import { fetchCommentsFromPlatform } from '../services/platformService';

export const pickWinner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform, postUrl, winnersCount } = req.body;

    if (!platform || !postUrl || !winnersCount) {
      res.status(400).json({ error: 'Please provide platform, postUrl, and winnersCount.' });
      return;
    }

    if (winnersCount < 1) {
      res.status(400).json({ error: 'Winners count must be at least 1.' });
      return;
    }

    // Fetch real comments from the platform API
    const comments = await fetchCommentsFromPlatform(platform, postUrl);
    
    if (comments.length < winnersCount) {
      res.status(400).json({ 
        error: `Not enough comments to pick ${winnersCount} winner(s). Found ${comments.length} comment(s).` 
      });
      return;
    }

    // Shuffle array using Fisher-Yates algorithm for better randomness
    const shuffled = [...comments].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, winnersCount);

    // Save giveaway record to MongoDB
    const newGiveaway = new Giveaway({ platform, postUrl, winnersCount, winners });
    await newGiveaway.save();

    res.status(200).json({
      message: 'Winners picked successfully!',
      winners,
      giveawayId: newGiveaway._id,
      totalComments: comments.length
    });
  } catch (error: any) {
    // Handle different error types with appropriate status codes
    const errorMessage = error.message || 'Server error while picking winners.';
    
    if (errorMessage.includes('Invalid') || errorMessage.includes('Expected format')) {
      res.status(400).json({ error: errorMessage });
    } else if (errorMessage.includes('not configured')) {
      res.status(400).json({ error: errorMessage });
    } else if (errorMessage.includes('not found') || errorMessage.includes('expired')) {
      res.status(401).json({ error: errorMessage });
    } else if (errorMessage.includes('Unsupported')) {
      res.status(400).json({ error: errorMessage });
    } else if (errorMessage.includes('disabled') || errorMessage.includes('private')) {
      res.status(403).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const history = await Giveaway.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
}
import { Request, Response } from 'express';
import Giveaway from '../models/giveaway';

// Simulated fetcher (Replace with actual API calls to YouTube/Meta later/ Insta and Facebook by frontend input field)
const fetchComments = (platform: string, url: string): string[] => {
  const mockUsers = [
    '@alex_dev', '@sarah_codes', '@mike_js', '@emma_ts', '@yogesh_veu','@yogesh_gandu','@yogesh_babu','@john_react','@dogesh_babu',
    '@john_react', '@lisa_node', '@chris_db', '@anna_css', '@pramod10', '@nina_html', '@tom_vue', '@lucy_angular', '@sam_python', '@kate_java', '@ryan_ruby'
  ];
  return mockUsers;
};

export const pickWinner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform, postUrl, winnersCount } = req.body;

    if (!platform || !postUrl || !winnersCount) {
      res.status(400).json({ error: 'Please provide platform, postUrl, and winnersCount.' });
      return;
    }

    const comments = fetchComments(platform, postUrl);
    
    if (comments.length < winnersCount) {
      res.status(400).json({ error: 'Not enough comments to pick that many winners.' });
      return;
    }

    // Shuffle array and slice the requested number of winners
    const shuffled = comments.sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, winnersCount);

    // Save giveaway record to MongoDB
    const newGiveaway = new Giveaway({ platform, postUrl, winnersCount, winners });
    await newGiveaway.save();

    res.status(200).json({
      message: 'Winners picked successfully!',
      winners,
      giveawayId: newGiveaway._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while picking winners.' });
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
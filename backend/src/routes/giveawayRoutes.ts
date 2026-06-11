import Router from 'express';
import { pickWinner, getHistory } from '../controllers/giveawayController';

const router = Router();

router.post('/pick-winner', pickWinner);
router.get('/history', getHistory);

export default router;

// Note: The above code defines the routes for the giveaway feature. 
// The POST route '/pick-winner' is used to pick winners based on the 
// provided platform, post URL, and number of winners. The GET route 
// '/history' retrieves the history of giveaways from the database.
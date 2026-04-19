import express from 'express';
import { chatWithAgent } from '../services/aiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatWithAgent(message, context);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat Route Error:', error);
    res.status(500).json({ error: 'Internal AI Reasoning Fault' });
  }
});

export default router;

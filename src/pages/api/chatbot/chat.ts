import { NextApiRequest, NextApiResponse } from 'next';
import { getChatbotService } from '@/core/di/container';
import { ChatMessage } from '@/core/interfaces/IChatbotService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages, context } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    // Get the chatbot service
    const chatbotService = getChatbotService();
    
    // Generate a response
    const response = await chatbotService.generateResponse(messages, context);
    
    // Return the response
    res.status(200).json(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
} 
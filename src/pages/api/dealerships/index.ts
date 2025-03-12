import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseService } from '@/core/di/container';
import { Dealership } from '@/core/models/Dealership';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbService = getDatabaseService();
  
  switch (req.method) {
    case 'GET':
      try {
        const dealerships = await dbService.query('dealerships', {});
        res.status(200).json(dealerships);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: errorMessage });
      }
      break;
      
    case 'POST':
      try {
        const dealership = req.body as Dealership;
        const id = await dbService.create('dealerships', dealership);
        res.status(201).json({ id, ...dealership });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: errorMessage });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

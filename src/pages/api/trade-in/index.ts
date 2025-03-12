import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseService } from '@/core/di/container';
import { VehicleDetails } from '@/core/models/VehicleDetails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbService = getDatabaseService();
  
  switch (req.method) {
    case 'POST':
      try {
        const vehicleDetails = req.body as VehicleDetails;
        // Here you would typically call a valuation service
        // For now, we'll just store the vehicle details
        const id = await dbService.create('vehicles', vehicleDetails);
        res.status(201).json({ id, ...vehicleDetails });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: errorMessage });
      }
      break;
      
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

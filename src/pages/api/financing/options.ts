import { NextApiRequest, NextApiResponse } from 'next';
import { getFinancingService, getDatabaseService } from '@/core/di/container';
import { validateFinancingRequest } from '@/utils/validation';
import { FinancingRequest } from '@/core/models/FinancingRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const financingRequest = req.body as FinancingRequest;
    
    // Validate the financing request
    const validationError = validateFinancingRequest(financingRequest);
    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }
    
    // Get the financing service
    const financingService = getFinancingService();
    
    // Get financing options
    const financingOptions = await financingService.getFinancingOptions(financingRequest);
    
    // Store the financing options in the database
    const dbService = getDatabaseService();
    const id = await dbService.create('financingOptions', financingOptions);
    
    // Return the financing options with the ID
    res.status(200).json({ id, ...financingOptions });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}
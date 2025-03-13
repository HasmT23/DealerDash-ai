import { FinancingRequest } from '@/core/models/FinancingRequest';
import { FinancingOptions } from '@/core/models/FinancingOptions';

export interface IFinancingService {
  getFinancingOptions(request: FinancingRequest): Promise<FinancingOptions>;
}
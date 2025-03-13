import { VehicleDetails } from '@/core/models/VehicleDetails';
import { TradeInValue } from '@/core/models/TradeInValue';

export interface IValuationService {
  getTradeInValue(vehicleDetails: VehicleDetails): Promise<TradeInValue>;
}

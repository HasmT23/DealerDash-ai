export interface TradeInValue {
    id?: string;
    vehicleId: string;
    valuationServiceName: string;
    estimatedValue: number;
    privatePartyValue?: number;
    dealerRetailValue?: number;
    tradeInValue?: number;
    valuationDate: string;
    valuationDetails?: Record<string, any>;
  }
  
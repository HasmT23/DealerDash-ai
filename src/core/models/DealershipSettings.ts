export interface DealershipSettings {
    preferredValuationService?: string;
    preferredFinancingService?: string;
    customRates?: {
      apr: number;
      term: number;
      downPaymentMin: number;
    }[];
    customFees?: {
      name: string;
      amount: number;
    }[];
  }
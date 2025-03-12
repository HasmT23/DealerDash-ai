export interface PaymentRequest {
    id?: string;
    vehiclePrice: number;
    downPayment: number;
    tradeInValue?: number;
    term: number; // in months
    apr: number;
    salesTax?: number;
    fees?: Fee[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Fee {
    name: string;
    amount: number;
    isRequired: boolean;
  }
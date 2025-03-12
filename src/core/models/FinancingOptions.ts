export interface FinancingOptions {
    id?: string;
    requestId: string;
    financingServiceName: string;
    options: FinancingOption[];
    bestOption?: FinancingOption;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface FinancingOption {
    lender: string;
    apr: number;
    term: number; // in months
    monthlyPayment: number;
    downPayment: number;
    totalInterest: number;
    totalCost: number;
    isRecommended?: boolean;
    requirements?: string[];
    fees?: Fee[];
  }
  
  export interface Fee {
    name: string;
    amount: number;
    isRequired: boolean;
  }
  
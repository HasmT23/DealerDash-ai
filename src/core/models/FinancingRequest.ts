export interface FinancingRequest {
    id?: string;
    vehicleId: string;
    customerInfo: CustomerInfo;
    loanAmount: number;
    downPayment: number;
    desiredTerm: number; // in months
    creditScore?: number;
    tradeInValue?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    employmentStatus?: 'employed' | 'self-employed' | 'unemployed' | 'retired';
    annualIncome?: number;
  }
  
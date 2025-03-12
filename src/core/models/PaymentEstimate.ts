export interface PaymentEstimate {
    id?: string;
    requestId: string;
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    amortizationSchedule?: AmortizationEntry[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AmortizationEntry {
    paymentNumber: number;
    paymentDate: string;
    paymentAmount: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }
  
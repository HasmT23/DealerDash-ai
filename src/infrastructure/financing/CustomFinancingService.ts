import { IFinancingService } from '@/core/interfaces/IFinancingService';
import { FinancingRequest } from '@/core/models/FinancingRequest';
import { FinancingOptions, FinancingOption, Fee } from '@/core/models/FinancingOptions';
import axios from 'axios';

export class CustomFinancingService implements IFinancingService {
  private baseRates: Record<string, number> = {
    'excellent': 3.99,  // 750+
    'good': 4.99,       // 700-749
    'fair': 6.99,       // 650-699
    'poor': 9.99,       // 600-649
    'bad': 14.99        // Below 600
  };
  
  private lenders: string[] = [
    'Capital One Auto Finance',
    'Bank of America',
    'Chase Auto',
    'Wells Fargo Auto',
    'Ally Financial',
    'LightStream',
    'CarMax Auto Finance',
    'PenFed Credit Union',
    'Navy Federal Credit Union'
  ];
  
  private standardFees: Fee[] = [
    { name: 'Documentation Fee', amount: 85, isRequired: true },
    { name: 'Title Fee', amount: 75, isRequired: true },
    { name: 'Registration Fee', amount: 250, isRequired: true }
  ];
  
  constructor() {
    // Try to fetch current rates if possible
    this.updateRates().catch(err => {
      console.warn('Could not update financing rates:', err.message);
    });
  }
  
  async getFinancingOptions(request: FinancingRequest): Promise<FinancingOptions> {
    try {
      // Determine credit tier based on credit score
      const creditTier = this.getCreditTier(request.creditScore);
      
      // Generate multiple financing options
      const options: FinancingOption[] = [];
      
      // Standard terms in months
      const terms = [36, 48, 60, 72, 84];
      
      // Generate an option for each term
      for (const term of terms) {
        // Skip longer terms for poor credit
        if ((creditTier === 'poor' || creditTier === 'bad') && term > 60) {
          continue;
        }
        
        // Calculate base APR with adjustments
        let baseApr = this.baseRates[creditTier];
        
        // Adjust APR based on term length (longer terms = higher rates)
        const termAdjustment = (term > 60) ? (term - 60) * 0.05 : 0;
        
        // Adjust APR based on down payment percentage
        const loanAmount = request.loanAmount;
        const downPaymentPercentage = (request.downPayment / (loanAmount + request.downPayment)) * 100;
        const downPaymentAdjustment = downPaymentPercentage >= 20 ? -0.5 : 0;
        
        // Final APR
        const apr = baseApr + termAdjustment + downPaymentAdjustment;
        
        // Calculate monthly payment
        const monthlyPayment = this.calculateMonthlyPayment(loanAmount, apr, term);
        
        // Calculate total interest
        const totalInterest = (monthlyPayment * term) - loanAmount;
        
        // Select a random lender
        const lender = this.lenders[Math.floor(Math.random() * this.lenders.length)];
        
        // Create the financing option
        options.push({
          lender,
          apr,
          term,
          monthlyPayment,
          downPayment: request.downPayment,
          totalInterest,
          totalCost: loanAmount + totalInterest,
          isRecommended: term === 60, // Recommend 60-month term as default
          fees: [...this.standardFees]
        });
      }
      
      // Sort options by monthly payment
      options.sort((a, b) => a.monthlyPayment - b.monthlyPayment);
      
      // Find the best option (lowest total cost with reasonable monthly payment)
      const bestOption = this.findBestOption(options);
      
      return {
        requestId: request.id || '',
        financingServiceName: 'Custom Financing Service',
        options,
        bestOption,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating financing options:', error);
      throw new Error('Failed to generate financing options');
    }
  }
  
  private getCreditTier(creditScore?: number): string {
    if (!creditScore) return 'good'; // Default to good if no score provided
    
    if (creditScore >= 750) return 'excellent';
    if (creditScore >= 700) return 'good';
    if (creditScore >= 650) return 'fair';
    if (creditScore >= 600) return 'poor';
    return 'bad';
  }
  
  private calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    return Math.round(payment * 100) / 100;
  }
  
  private findBestOption(options: FinancingOption[]): FinancingOption {
    // Start with the middle option as a balanced choice
    const middleIndex = Math.floor(options.length / 2);
    let bestOption = options[middleIndex];
    
    // Mark it as recommended
    options.forEach(option => {
      option.isRecommended = option === bestOption;
    });
    
    return bestOption;
  }
  
  private async updateRates(): Promise<void> {
    try {
      // In a real implementation, you would fetch current rates from an API
      // For now, we'll use a mock API call that could be replaced later
      
      // Example of how you might fetch from a real API:
      // const response = await axios.get('https://api.example.com/auto-loan-rates', {
      //   params: { api_key: process.env.RATE_API_KEY }
      // });
      // this.baseRates = response.data.rates;
      
      // For now, we'll just use our hardcoded rates
    } catch (error) {
      console.error('Failed to update financing rates:', error);
    }
  }
}
import { validateFinancingRequest } from '@/utils/validation';
import { FinancingRequest } from '@/core/models/FinancingRequest';

describe('FinancingRequest Validation', () => {
  test('should validate a valid financing request', () => {
    const request: FinancingRequest = {
      vehicleId: '123',
      customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      loanAmount: 25000,
      downPayment: 5000,
      desiredTerm: 60,
      creditScore: 720
    };
    
    const error = validateFinancingRequest(request);
    expect(error).toBeNull();
  });
  
  test('should reject missing vehicle ID', () => {
    const request: FinancingRequest = {
      vehicleId: '',
      customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      loanAmount: 25000,
      downPayment: 5000,
      desiredTerm: 60
    };
    
    const error = validateFinancingRequest(request);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('Vehicle ID');
  });
});

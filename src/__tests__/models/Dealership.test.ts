import { validateDealership } from '@/utils/validation';
import { Dealership } from '@/core/models/Dealership';

describe('Dealership Validation', () => {
  test('should validate a valid dealership', () => {
    const dealership: Dealership = {
      name: 'ABC Motors',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      phone: '555-123-4567',
      email: 'info@abcmotors.com',
      website: 'https://abcmotors.com'
    };
    
    const error = validateDealership(dealership);
    expect(error).toBeNull();
  });
  
  test('should reject missing name', () => {
    const dealership: Dealership = {
      name: '',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      phone: '555-123-4567',
      email: 'info@abcmotors.com'
    };
    
    const error = validateDealership(dealership);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('name');
  });
  
  test('should reject invalid zip code', () => {
    const dealership: Dealership = {
      name: 'ABC Motors',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: 'invalid',
      phone: '555-123-4567',
      email: 'info@abcmotors.com'
    };
    
    const error = validateDealership(dealership);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('ZIP');
  });
  
  test('should reject invalid phone number', () => {
    const dealership: Dealership = {
      name: 'ABC Motors',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      phone: '123',
      email: 'info@abcmotors.com'
    };
    
    const error = validateDealership(dealership);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('phone');
  });
  
  test('should reject invalid email', () => {
    const dealership: Dealership = {
      name: 'ABC Motors',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      phone: '555-123-4567',
      email: 'invalid-email'
    };
    
    const error = validateDealership(dealership);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('email');
  });
});

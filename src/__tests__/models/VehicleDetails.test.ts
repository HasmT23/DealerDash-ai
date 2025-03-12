import { validateVehicleDetails } from '@/utils/validation';
import { VehicleDetails } from '@/core/models/VehicleDetails';

describe('VehicleDetails Validation', () => {
  test('should validate a valid vehicle', () => {
    const vehicle: VehicleDetails = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 25000,
      vin: '1HGCM82633A123456'
    };
    
    const error = validateVehicleDetails(vehicle);
    expect(error).toBeNull();
  });
  
  test('should reject invalid year', () => {
    const vehicle: VehicleDetails = {
      year: 1800, // Too old
      make: 'Toyota',
      model: 'Camry',
      mileage: 25000
    };
    
    const error = validateVehicleDetails(vehicle);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('year');
  });
  
  test('should reject missing make', () => {
    const vehicle: VehicleDetails = {
      year: 2020,
      make: '',
      model: 'Camry',
      mileage: 25000
    };
    
    const error = validateVehicleDetails(vehicle);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('make');
  });
  
  test('should reject negative mileage', () => {
    const vehicle: VehicleDetails = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: -100
    };
    
    const error = validateVehicleDetails(vehicle);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('mileage');
  });
  
  test('should reject invalid VIN', () => {
    const vehicle: VehicleDetails = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 25000,
      vin: 'INVALID'
    };
    
    const error = validateVehicleDetails(vehicle);
    expect(error).not.toBeNull();
    expect(error?.message).toContain('VIN');
  });
});

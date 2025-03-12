import { VehicleDetails } from '@/core/models/VehicleDetails';
import { FinancingRequest } from '@/core/models/FinancingRequest';
import { PaymentRequest } from '@/core/models/PaymentRequest';
import { Dealership } from '@/core/models/Dealership';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateVehicleDetails(vehicle: VehicleDetails): ValidationError | null {
  if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
    return new ValidationError('Invalid vehicle year');
  }
  
  if (!vehicle.make || vehicle.make.trim() === '') {
    return new ValidationError('Vehicle make is required');
  }
  
  if (!vehicle.model || vehicle.model.trim() === '') {
    return new ValidationError('Vehicle model is required');
  }
  
  if (vehicle.mileage === undefined || vehicle.mileage < 0) {
    return new ValidationError('Invalid vehicle mileage');
  }
  
  if (vehicle.vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicle.vin)) {
    return new ValidationError('Invalid VIN format');
  }
  
  return null;
}

export function validateFinancingRequest(request: FinancingRequest): ValidationError | null {
  if (!request.vehicleId) {
    return new ValidationError('Vehicle ID is required');
  }
  
  if (!request.customerInfo.firstName || request.customerInfo.firstName.trim() === '') {
    return new ValidationError('Customer first name is required');
  }
  
  if (!request.customerInfo.lastName || request.customerInfo.lastName.trim() === '') {
    return new ValidationError('Customer last name is required');
  }
  
  if (!request.customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.customerInfo.email)) {
    return new ValidationError('Valid email is required');
  }
  
  if (request.loanAmount <= 0) {
    return new ValidationError('Loan amount must be greater than zero');
  }
  
  if (request.downPayment < 0) {
    return new ValidationError('Down payment cannot be negative');
  }
  
  if (request.desiredTerm <= 0 || request.desiredTerm > 84) {
    return new ValidationError('Loan term must be between 1 and 84 months');
  }
  
  if (request.creditScore && (request.creditScore < 300 || request.creditScore > 850)) {
    return new ValidationError('Credit score must be between 300 and 850');
  }
  
  return null;
}

export function validatePaymentRequest(request: PaymentRequest): ValidationError | null {
  if (request.vehiclePrice <= 0) {
    return new ValidationError('Vehicle price must be greater than zero');
  }
  
  if (request.downPayment < 0) {
    return new ValidationError('Down payment cannot be negative');
  }
  
  if (request.term <= 0 || request.term > 84) {
    return new ValidationError('Loan term must be between 1 and 84 months');
  }
  
  if (request.apr < 0) {
    return new ValidationError('APR cannot be negative');
  }
  
  if (request.salesTax !== undefined && request.salesTax < 0) {
    return new ValidationError('Sales tax cannot be negative');
  }
  
  return null;
}

export function validateDealership(dealership: Dealership): ValidationError | null {
  if (!dealership.name || dealership.name.trim() === '') {
    return new ValidationError('Dealership name is required');
  }
  
  if (!dealership.address || dealership.address.trim() === '') {
    return new ValidationError('Address is required');
  }
  
  if (!dealership.city || dealership.city.trim() === '') {
    return new ValidationError('City is required');
  }
  
  if (!dealership.state || dealership.state.trim() === '') {
    return new ValidationError('State is required');
  }
  
  if (!dealership.zip || !/^\d{5}(-\d{4})?$/.test(dealership.zip)) {
    return new ValidationError('Valid ZIP code is required');
  }
  
  if (!dealership.phone || !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(dealership.phone)) {
    return new ValidationError('Valid phone number is required');
  }
  
  if (!dealership.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dealership.email)) {
    return new ValidationError('Valid email is required');
  }
  
  return null;
}

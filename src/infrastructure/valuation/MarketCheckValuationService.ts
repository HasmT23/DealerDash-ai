import { IValuationService } from '@/core/interfaces/IValuationService';
import { VehicleDetails } from '@/core/models/VehicleDetails';
import { TradeInValue } from '@/core/models/TradeInValue';
import axios from 'axios';

export class MarketCheckValuationService implements IValuationService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MARKETCHECK_API_KEY || '';
    this.baseUrl = 'https://api.marketcheck.com/v2';
    
    if (!this.apiKey) {
      console.warn('MarketCheck API key is not set. Valuation service will not work properly.');
    }
  }

  async getTradeInValue(vehicleDetails: VehicleDetails): Promise<TradeInValue> {
    try {
      // Get the valuation data from MarketCheck
      const valuationData = await this.getValuationData(vehicleDetails);
      
      // Calculate trade-in value (typically 10-15% below average market price)
      const averagePrice = valuationData.averagePrice || 0;
      const tradeInValue = Math.round(averagePrice * 0.85); // 15% below market price
      const dealerRetailValue = averagePrice;
      const privatePartyValue = Math.round(averagePrice * 0.95); // 5% below market price
      
      return {
        vehicleId: vehicleDetails.id || '',
        valuationServiceName: 'MarketCheck',
        estimatedValue: tradeInValue,
        privatePartyValue: privatePartyValue,
        dealerRetailValue: dealerRetailValue,
        tradeInValue: tradeInValue,
        valuationDate: new Date().toISOString(),
        valuationDetails: valuationData
      };
    } catch (error) {
      console.error('Error getting trade-in value from MarketCheck:', error);
      throw new Error('Failed to retrieve vehicle valuation');
    }
  }

  private async getValuationData(vehicleDetails: VehicleDetails): Promise<any> {
    const url = `${this.baseUrl}/search/car/active`;
    
    const params = {
      api_key: this.apiKey,
      year: vehicleDetails.year,
      make: vehicleDetails.make,
      model: vehicleDetails.model,
      trim: vehicleDetails.trim || '',
      radius: 200,
      zip: vehicleDetails.zipCode || '90210',
      stats: 'price',
      facets: 'year,make,model,trim,mileage'
    };
    
    const response = await axios.get(url, { params });
    
    // Extract the relevant data from the response
    const stats = response.data.stats || {};
    const listings = response.data.listings || [];
    
    // Calculate average price based on mileage range
    const targetMileage = vehicleDetails.mileage;
    const similarVehicles = listings.filter((listing: any) => {
      const mileage = listing.miles || 0;
      // Consider vehicles with mileage within ±20% of target
      return mileage >= targetMileage * 0.8 && mileage <= targetMileage * 1.2;
    });
    
    let averagePrice = stats.price?.mean || 0;
    
    // If we have similar vehicles, calculate their average price
    if (similarVehicles.length > 0) {
      const sum = similarVehicles.reduce((total: number, listing: any) => total + (listing.price || 0), 0);
      averagePrice = sum / similarVehicles.length;
    }
    
    // Apply condition adjustment
    const conditionAdjustment = this.getConditionAdjustment(vehicleDetails.condition || 'good');
    averagePrice = averagePrice * conditionAdjustment;
    
    return {
      averagePrice,
      totalListings: stats.price?.count || 0,
      priceRange: {
        low: stats.price?.min || 0,
        high: stats.price?.max || 0
      },
      similarVehiclesCount: similarVehicles.length,
      condition: vehicleDetails.condition || 'good',
      mileageAdjustment: this.getMileageAdjustment(vehicleDetails.mileage, stats.miles?.mean || 0)
    };
  }
  
  private getConditionAdjustment(condition: string): number {
    switch (condition.toLowerCase()) {
      case 'excellent': return 1.1;  // 10% above average
      case 'good': return 1.0;       // Average price
      case 'fair': return 0.9;       // 10% below average
      case 'poor': return 0.8;       // 20% below average
      default: return 1.0;
    }
  }
  
  private getMileageAdjustment(actualMileage: number, averageMileage: number): number {
    if (averageMileage === 0) return 1.0;
    
    // Calculate percentage difference from average
    const difference = (averageMileage - actualMileage) / averageMileage;
    
    // Apply a small adjustment (±5% max) based on mileage difference
    return Math.max(0.95, Math.min(1.05, 1 + (difference * 0.1)));
  }
}
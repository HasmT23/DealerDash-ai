export interface VehicleDetails {
    id?: string;
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    vin?: string;
    condition?: 'excellent' | 'good' | 'fair' | 'poor';
    exteriorColor?: string;
    interiorColor?: string;
    features?: string[];
    images?: string[];
    price?: number;
  }
  
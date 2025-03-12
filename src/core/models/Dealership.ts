import { DealershipSettings } from "./DealershipSettings";

export interface Dealership {
    id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    settings?: DealershipSettings;
    createdAt?: string;
    updatedAt?: string;
  }
  
  

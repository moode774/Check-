export type UserRole = 'admin' | 'owner' | 'tenant' | 'agent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  verified: boolean;
  created_at: string;
}

export type PropertyType = 'apartment' | 'house' | 'shop' | 'office' | 'villa' | 'land';
export type PropertyStatus = 'available' | 'rented' | 'reserved';

export interface Property {
  id: number;
  owner_id?: number;
  agent_id?: number;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  city: string;
  district: string;
  area: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  features: string[];
  images: string[];
  status: PropertyStatus;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface Contract {
  id: number;
  property_id: number;
  tenant_id: number;
  owner_id: number;
  agent_id?: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: 'pending' | 'active' | 'expired' | 'terminated';
  owner_signed: boolean;
  tenant_signed: boolean;
  created_at: string;
}

export interface Payment {
  id: number;
  contract_id: number;
  amount: number;
  payment_date: string;
  method: string;
  status: 'pending' | 'paid' | 'failed';
  receipt_url?: string;
}

export interface Review {
  id: number;
  property_id: number;
  reviewer_id: number;
  rating: number;
  comment: string;
  created_at: string;
}


export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed'
}

export type DeliveryType = 'Home' | 'Gym';
export type WorkoutIntensity = 'Rest Day' | 'HIIT / Cardio' | 'Heavy Lifting';

export interface Macros {
  p: number; // Protein
  c: number; // Carbs
  f: number; // Fats
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  calories: number;
  macros: Macros;
  rating: number;
  fuelPoints: number;
  dietType: 'veg' | 'non-veg' | 'vegan';
}

export interface MealPrepContainer {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  macros: Macros;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface MacroResults {
  bmr: number;
  tdee: number;
  protein: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  totalMacros: Macros;
  totalCalories: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  deliveryType: DeliveryType;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    flatInfo?: string;
    landmark?: string;
  };
  deliveryPersonId?: string;
  specialInstructions?: string;
  estimatedDeliveryTime: string;
}

export interface DeliveryBoy {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'busy' | 'offline';
  phone: string;
}

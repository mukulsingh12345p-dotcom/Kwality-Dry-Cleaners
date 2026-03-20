export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  icon?: string;
}

export type CartItem = { 
  id: string; 
  name: string; 
  quantity: number; 
  price: number;
};

export type OrderStatus = 'pending' | 'accepted' | 'confirmed' | 'processing' | 'ironing' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  pickupDate: string;
  status: OrderStatus;
  date: string;
  userContact: string;
  userName: string;
  paymentMethod: 'COD' | 'Online';
}

export interface UserStats {
  electricitySaved: number; // in Kwh
  waterSaved: number; // in L
  timeSaved: number; // in Hrs
}

export interface UserProfile {
  name: string;
  address: string;
  email: string;
  contact: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'offer' | 'info';
  isNew: boolean;
  userContact?: string; // If present, only this user sees it. If absent, everyone sees it.
}

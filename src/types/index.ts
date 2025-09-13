export interface PinCode {
  pin: string;
  area: string;
  region: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  nutritionalInfo?: string;
  recipeIdea?: string;
  variants: ProductVariant[];
  isAvailable: boolean;
  createdAt: string;
}

export interface ProductVariant {
  weight: '300g' | '500g' | '1kg';
  price: number;
  originalPrice?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  pinCode?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  addresses: Address[];
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  pinCode: string;
  landmark?: string;
  optionalPhone?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  loyaltyUsed: number;
  deliveryDate: string;
  timeSlot: '10:00-14:00' | '16:00-20:00';
  address: Address;
  status: 'pending' | 'confirmed' | 'packed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'crafts' | 'organic' | 'gear' | 'clothing' | 'tech';
  categoryLabel: string;
  price: number; // in NPR
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  origin: string; // e.g. "Palpa, Lumbini" | "Ilam, Koshi" | "Mustang, Gandaki"
  artisanTag?: string; // e.g. "Heritage Handloom", "Wild Cliff Harvest"
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  city?: string;
  address?: string;
  rewardPoints: number;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'esewa' | 'khalti' | 'cod' | 'connectips';
  paymentStatus: 'paid' | 'pending';
  orderStatus: 'Processing' | 'Dispatched (Kathmandu Hub)' | 'Out for Delivery' | 'Delivered';
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
  };
}

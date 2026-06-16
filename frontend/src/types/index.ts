export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  category: string;
  image_url: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  title: string;
  price: number;
  mrp: number;
  stock: number;
  image_url: string | null;
  category: string;
  line_total: number;
}

export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  title?: string;
  image_url?: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  razorpay_order_id?: string | null;
  shipping_address?: Record<string, string>;
  created_at: string;
  items: OrderItem[];
  user_name?: string;
  user_email?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

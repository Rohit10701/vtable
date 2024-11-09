export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  orderId: string;
}

export interface Order {
  id: string;
  customerName: string;
  orderAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface OrdersResponse {
  data: Order[];
  nextCursor: string | null;
  totalCount: number;
}

export interface SortConfig {
  field: keyof Order;
  direction: 'asc' | 'desc';
}
import { FoodItem } from './food-item.model';
import { OrderStatus } from './food-order-status.model';

export interface FoodOrder {
  id?: number;
  costumerName: string;
  orders: FoodItem[];
  foodOrderStatus:
    | 'WAITING'
    | 'PREPARING'
    | 'COMPLETE'
    | 'CANCELED'
    | 'CONFIRMED';
  ifoodOrderId?: string;
  createdAt: Date;
  observations?: string;
}

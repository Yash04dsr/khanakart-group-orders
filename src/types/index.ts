
export type UserRole = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "appetizers" | "main_course" | "bread" | "beverages";
  price: number;
  allowsFractions: boolean;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface UserOrder {
  userId: string;
  userName: string;
  items: OrderItem[];
}

export interface OrderSession {
  id: string;
  title: string;
  createdAt: string;
  deadline: string;
  isActive: boolean;
  orders: UserOrder[];
  orderCount?: number; // Add this optional field for order count
}

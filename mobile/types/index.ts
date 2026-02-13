export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MASTER";
  createdAt?: string;
}

export interface loginResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MASTER";
  token: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  banner: string;
  category?: Category;
  categoryId: string;
  disabled: boolean;
  createdAt: string;
}

export interface Item {
  id: string;
  amount: number;
  orderIr: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface CreateOrderRequest {
  name?: string;
  table: number;
}

export interface AddItemRequest {
  productId: string;
  orderId: string;
  amount: number;
}

export interface SendOrderRequest {
  orderId: string;
}

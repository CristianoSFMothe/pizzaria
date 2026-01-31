export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MASTER";
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MASTER";
  token: string;
}

export interface Categories {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  banner: string;
  disabled: boolean;
  category_id: string;
  createdAt: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface Items {
  id: string;
  amount: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    banner: string;
  };
}

export interface Order {
  id: string;
  table: string;
  name?: string;
  status: boolean;
  draft: boolean;
  items?: Items[];
  createdAt: string;
}

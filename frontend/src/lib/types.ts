export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
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

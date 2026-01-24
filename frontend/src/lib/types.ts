export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  password: string;
  createdAt: string;
  updatedAt: string;
}

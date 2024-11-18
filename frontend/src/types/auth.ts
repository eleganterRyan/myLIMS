export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'staff' | 'researcher';
  email?: string;
  createdAt?: string;
  updatedAt?: string;
} 
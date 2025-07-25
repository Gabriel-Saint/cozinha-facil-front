export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'ADMIN' | 'CLIENT';
  avatarUrl?: string;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  paymentProvider: string;
  paymentId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
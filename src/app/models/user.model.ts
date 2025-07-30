// Interface para o histórico de pagamentos
export interface PaymentHistory {
  id: string;
  amount: number;
  paymentDate: Date;
  invoiceId: string;
}

// Interface para a subscrição
export interface Subscription {
  id: string;
  status: string;
  expiresAt: Date;
  paymentHistory?: PaymentHistory[]; // Adicionado aqui
}

// Interface principal do Utilizador
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'CLIENT' | 'ADMIN';
  avatarUrl?: string | null;
  subscription?: Subscription | null;
  paymentHistory?: PaymentHistory[]; // Adicionado aqui para o template funcionar
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces para o fluxo de login
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

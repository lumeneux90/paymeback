import { DebtStatus } from "./enums";

export type User = {
  id: string;
  name: string;
  avatar_url?: string;
  funny_description?: string;
};

export type Debt = {
  id: string;
  from_user: string;
  to_user: string;
  amount: number;
  description: string;
  tag: string;
  sbp_link?: string;
  status: DebtStatus;
  created_at: string;
  paid_at?: string;
  // Данные пользователей (JOIN)
  from_user_data?: {
    id: string;
    name: string;
  };
  to_user_data?: {
    id: string;
    name: string;
  };
};

export type Session = {
  user: User;
  token: string;
} | null;

export type ClientPayment = {
  id: string;
  client_id: string;
  amount: number;
  paid_at: string; // ISO date 'YYYY-MM-DD'
  notes: string | null;
  created_at: string | null;
};

export type CreateClientPaymentInput = {
  client_id: string;
  amount: number;
  paid_at: string;
  notes?: string | null;
};

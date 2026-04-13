export type UserRole = 'admin' | 'sales';

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string | null;
  updated_at: string | null;
};

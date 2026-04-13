import type { UserRole } from './profile';

export type { UserRole };

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
};

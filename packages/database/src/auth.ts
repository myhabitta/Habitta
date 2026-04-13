import type { Session } from '@supabase/supabase-js';
import type { AuthUser } from '@habitta/types';

import { createServerClient, createBrowserClient, createAdminClient } from './client';

export const getSession = async (): Promise<Session | null> => {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getAuthUser = async (): Promise<AuthUser | null> => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fullName = user.user_metadata?.full_name as string | undefined;
  return {
    id: user.id,
    email: user.email ?? '',
    role: (user.user_metadata?.role as AuthUser['role']) ?? 'sales',
    ...(fullName !== undefined && { full_name: fullName }),
  };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Error al iniciar sesión' };
  }

  const fullName = data.user.user_metadata?.full_name as string | undefined;
  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? '',
      role: (data.user.user_metadata?.role as AuthUser['role']) ?? 'sales',
      ...(fullName !== undefined && { full_name: fullName }),
    },
    error: null,
  };
};

export const signOut = async (): Promise<{ error: null } | { error: string }> => {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { error: null };
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string
): Promise<{ error: null } | { error: string }> => {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) return { error: error.message };
  return { error: null };
};

export const getAllUsers = async (): Promise<AuthUser[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return [];
  return data.users.map((u) => {
    const fullName = u.user_metadata?.full_name as string | undefined;
    return {
      id: u.id,
      email: u.email ?? '',
      role: (u.user_metadata?.role as AuthUser['role']) ?? 'sales',
      ...(fullName !== undefined && { full_name: fullName }),
    };
  });
};

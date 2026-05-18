import type { Session } from '@supabase/supabase-js';
import type { AuthUser } from '@habitta/types';

import { createServerClient, createBrowserClient, createAdminClient } from './client';

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: AuthUser['role'] | null;
};

export const getSession = async (): Promise<Session | null> => {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getAuthUser = async (): Promise<AuthUser | null> => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();
  const typedProfile = profile as ProfileRow | null;

  return {
    id: user.id,
    email: user.email ?? '',
    role: (typedProfile?.role as AuthUser['role']) ?? 'user',
    ...(typedProfile?.full_name && { full_name: typedProfile.full_name }),
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
      role: (data.user.user_metadata?.role as AuthUser['role']) ?? 'user',
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

export const createUser = async (
  email: string,
  password: string,
  full_name: string,
  role: AuthUser['role']
): Promise<{ user: AuthUser | null; error: string | null }> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });

  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Error al crear usuario' };
  }

  // Upsert profile
  await (supabase as any)
    .from('profiles')
    .upsert({ id: data.user.id, full_name, role });

  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? '',
      role,
      full_name,
    },
    error: null,
  };
};

export const deleteUser = async (
  userId: string
): Promise<{ error: string | null }> => {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  return { error: null };
};

export const resetPasswordForEmail = async (
  email: string
): Promise<{ error: string | null }> => {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/login/reset`,
  });
  if (error) return { error: error.message };
  return { error: null };
};

export const updateUserMetadata = async (
  userId: string,
  metadata: { full_name?: string; role?: AuthUser['role'] }
): Promise<{ error: string | null }> => {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });
  if (error) return { error: error.message };
  return { error: null };
};

export const getAllUsers = async (): Promise<AuthUser[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return [];

  const { data: profiles } = await (supabase as any)
    .from('profiles')
    .select('id, full_name, role');
  const typedProfiles = (profiles ?? []) as ProfileRow[];

  const profileMap = new Map(
    typedProfiles.map((p) => [p.id, p])
  );

  return data.users.map((u) => {
    const profile = profileMap.get(u.id);
    return {
      id: u.id,
      email: u.email ?? '',
      role: (profile?.role as AuthUser['role']) ?? 'user',
      ...(profile?.full_name && { full_name: profile.full_name }),
    };
  });
};

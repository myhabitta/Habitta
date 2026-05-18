import type { Profile } from '@habitta/types';
import { createServerClient, createAdminClient } from '../client';

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as Profile;
};

export const updateProfile = async (
  userId: string,
  data: Partial<Pick<Profile, 'full_name' | 'role'>>
): Promise<Profile> => {
  const supabase = createAdminClient();
  const { data: profile, error } = await (supabase as any)
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return profile as Profile;
};

export const getProfiles = async (): Promise<Profile[]> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Profile[];
};

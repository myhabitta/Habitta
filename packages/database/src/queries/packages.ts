import type { Package } from '@habitta/types';

import { createServerClient } from '../client';

export type CreatePackageInput = {
  project_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  features: string[];
  status: 'active' | 'inactive';
};

export type UpdatePackageInput = Partial<CreatePackageInput>;

export const getPackagesByProject = async (projectId: string): Promise<Package[]> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'active')
    .order('price', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Package[]) ?? [];
};

export const getPackageBySlug = async (projectId: string, slug: string): Promise<Package | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('project_id', projectId)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Package;
};

export const getPackageById = async (id: string): Promise<Package | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Package;
};

export const createPackage = async (input: CreatePackageInput): Promise<Package> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .insert(input as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo crear el paquete');

  return data as Package;
};

export const updatePackage = async (id: string, input: UpdatePackageInput): Promise<Package> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo actualizar el paquete');

  return data as Package;
};

export const deletePackage = async (id: string): Promise<void> => {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('packages')
    .update({ status: 'inactive' } as never)
    .eq('id', id);

  if (error) throw new Error(error.message);
};

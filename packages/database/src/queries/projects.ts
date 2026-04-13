import type { Project, ProjectWithClientCount } from '@habitta/types';

import { createServerClient } from '../client';

export type CreateProjectInput = {
  name: string;
  slug: string;
  city: string;
  department: string;
  description?: string;
  status: 'active' | 'inactive' | 'coming_soon';
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export const getProjects = async (): Promise<Project[]> => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as Project[]) ?? [];
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('getProjects: error desconocido');
  }
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Project;
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Project;
};

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('projects')
    .insert(input as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo crear el proyecto');

  return data as Project;
};

export const updateProject = async (id: string, input: UpdateProjectInput): Promise<Project> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('projects')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No se pudo actualizar el proyecto');

  return data as Project;
};

export const getProjectsWithClientCount = async (): Promise<ProjectWithClientCount[]> => {
  const supabase = createServerClient();

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const projectList = (projects as Project[]) ?? [];

    // Count clients per project
    const { data: clientCounts, error: countError } = await supabase
      .from('clients')
      .select('project_id');

    if (countError) throw new Error(countError.message);

    const countMap = new Map<string, number>();
    for (const row of clientCounts ?? []) {
      const pid = (row as { project_id: string }).project_id;
      countMap.set(pid, (countMap.get(pid) ?? 0) + 1);
    }

    return projectList.map((p) => ({
      ...p,
      client_count: countMap.get(p.id) ?? 0,
    }));
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('getProjectsWithClientCount: error desconocido');
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('projects')
    .update({ status: 'inactive' } as never)
    .eq('id', id);

  if (error) throw new Error(error.message);
};

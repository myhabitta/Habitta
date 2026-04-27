'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProject, updateProject, createPackage, updatePackage } from '@habitta/database';
import { slugify } from '@habitta/utils';

export const createProjectAction = async (
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> => {
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const department = formData.get('department') as string;
  const description = formData.get('description') as string | null;
  const status = (formData.get('status') as 'active' | 'inactive') ?? 'active';

  try {
    await createProject({
      name,
      slug: slugify(name),
      city,
      department,
      ...(description ? { description } : {}),
      status,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al crear el proyecto' };
  }

  revalidatePath('/projects');
  redirect('/projects');
};

export const updateProjectAction = async (
  id: string,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> => {
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const department = formData.get('department') as string;
  const description = formData.get('description') as string | null;
  const status = (formData.get('status') as 'active' | 'inactive') ?? 'active';

  let updatedProject;
  try {
    updatedProject = await updateProject(id, {
      name,
      city,
      department,
      ...(description ? { description } : {}),
      status,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar el proyecto' };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${updatedProject.slug}`);
  redirect(`/projects/${updatedProject.slug}`);
};

export const createPackageAction = async (
  projectId: string,
  projectSlug: string,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const priceRaw = formData.get('price') as string;
  const featuresRaw = formData.get('features') as string;
  const status = (formData.get('status') as 'active' | 'inactive') ?? 'active';

  const price = parseFloat(priceRaw);
  const features = featuresRaw
    ? featuresRaw
        .split(/[,\n]/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  try {
    await createPackage({
      project_id: projectId,
      name,
      slug: slugify(name),
      ...(description ? { description } : {}),
      price,
      features,
      status,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al crear el paquete' };
  }

  revalidatePath(`/projects/${projectSlug}`);
  redirect(`/projects/${projectSlug}`);
};

export const updatePackageAction = async (
  id: string,
  projectId: string,
  projectSlug: string,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const priceRaw = formData.get('price') as string;
  const featuresRaw = formData.get('features') as string;
  const status = (formData.get('status') as 'active' | 'inactive') ?? 'active';

  const price = parseFloat(priceRaw);
  const features = featuresRaw
    ? featuresRaw
        .split(/[,\n]/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  try {
    await updatePackage(id, {
      name,
      ...(description ? { description } : {}),
      price,
      features,
      status,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar el paquete' };
  }

  revalidatePath(`/projects/${projectSlug}`);
  redirect(`/projects/${projectSlug}`);
};

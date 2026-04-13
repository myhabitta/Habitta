'use server';

import { updateUserPassword, updateProfile, getAuthUser } from '@habitta/database';
import { revalidatePath } from 'next/cache';

type ActionState = { error: string } | { success: string } | null;

export const changePasswordAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'admin') {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  const userId = formData.get('userId') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!userId || !password) return { error: 'Datos incompletos.' };
  if (password.length < 6) return { error: 'La contraseña debe tener mínimo 6 caracteres.' };
  if (password !== confirmPassword) return { error: 'Las contraseñas no coinciden.' };

  const result = await updateUserPassword(userId, password);
  if (result.error) return { error: result.error };

  revalidatePath('/dashboard/usuarios');
  return { success: 'Contraseña actualizada correctamente.' };
};

export const updateProfileAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'admin') {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  const userId = formData.get('userId') as string;
  const full_name = formData.get('full_name') as string;
  const role = formData.get('role') as 'admin' | 'sales';

  if (!userId || !full_name || !role) return { error: 'Datos incompletos.' };

  const result = await updateProfile(userId, { full_name, role });
  if (!result) return { error: 'Error al actualizar el perfil.' };

  revalidatePath('/dashboard/usuarios');
  return { success: 'Perfil actualizado correctamente.' };
};

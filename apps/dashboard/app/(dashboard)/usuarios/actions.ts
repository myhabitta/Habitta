'use server';

import { updateUserPassword, updateUserMetadata, updateProfile, getAuthUser, createUser, deleteUser } from '@habitta/database';
import { revalidatePath } from 'next/cache';

type ActionState = { error: string } | { success: string } | null;

export const changePasswordAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'super_admin') {
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

  revalidatePath('/usuarios');
  return { success: 'Contraseña actualizada correctamente.' };
};

export const updateProfileAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'super_admin') {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  const userId = formData.get('userId') as string;
  const full_name = formData.get('full_name') as string;
  const role = formData.get('role') as 'super_admin' | 'admin' | 'user';

  if (!userId || !full_name || !role) return { error: 'Datos incompletos.' };

  try {
    await updateProfile(userId, { full_name, role });
    await updateUserMetadata(userId, { full_name, role });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar el perfil.' };
  }

  revalidatePath('/usuarios');
  return { success: 'Perfil actualizado correctamente.' };
};

export const createUserAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'super_admin') {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  const role = formData.get('role') as 'super_admin' | 'admin' | 'user';

  if (!email || !password || !full_name || !role) return { error: 'Todos los campos son obligatorios.' };
  if (password.length < 6) return { error: 'La contraseña debe tener mínimo 6 caracteres.' };

  const result = await createUser(email, password, full_name, role);
  if (result.error) return { error: result.error };

  revalidatePath('/usuarios');
  return { success: `Usuario ${email} creado correctamente.` };
};

export const deleteUserAction = async (
  userId: string
): Promise<ActionState> => {
  const currentUser = await getAuthUser();
  if (currentUser?.role !== 'super_admin') {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  if (!userId) return { error: 'ID de usuario requerido.' };

  // Don't allow deleting yourself
  if (userId === currentUser.id) {
    return { error: 'No puedes eliminar tu propia cuenta.' };
  }

  const result = await deleteUser(userId);
  if (result.error) return { error: result.error };

  revalidatePath('/usuarios');
  return { success: 'Usuario eliminado correctamente.' };
};

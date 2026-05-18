'use server';

import { resetPasswordForEmail } from '@habitta/database';

type ActionState = { error: string } | { success: string } | null;

export const forgotPasswordAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const email = formData.get('email') as string;

  if (!email) return { error: 'Ingresa tu correo electrónico.' };

  const result = await resetPasswordForEmail(email);

  if (result.error) return { error: result.error };

  return {
    success: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
  };
};

'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@habitta/database';

type ActionState = { error: string } | null;

export const loginAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' };
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Credenciales incorrectas.' };
  }

  redirect('/dashboard');
};

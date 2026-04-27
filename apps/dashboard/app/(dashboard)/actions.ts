'use server';

import { createServerClient } from '@habitta/database';
import { redirect } from 'next/navigation';

export const logoutAction = async (): Promise<void> => {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
};

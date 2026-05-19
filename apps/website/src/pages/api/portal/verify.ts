export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, cedula } = body as { email?: string; cedula?: string };

    if (!email || !cedula) {
      return new Response(JSON.stringify({ error: 'Email y cédula son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('clients')
      .select('id, portal_slug')
      .eq('cedula', cedula)
      .eq('email', email)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'No se encontró un cliente con esos datos. Verifica tu correo y cédula.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, slug: data.portal_slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[portal/verify] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

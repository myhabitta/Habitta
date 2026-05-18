import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@habitta/database';

const PUBLIC_ROUTES = ['/login', '/login/forgot', '/login/reset'];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  // 1. Crear cliente y refrescar sesión (obligatorio con @supabase/ssr)
  const { supabase, response: updatedResponse } = createMiddlewareClient(request, response);
  await supabase.auth.getSession();

  // 2. Obtener usuario
  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));

  // 3. Ruta pública (/login)
  if (isPublicRoute) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return updatedResponse;
  }

  // 4. Rutas protegidas — sin sesión → /login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Protección por rol se maneja a nivel de página (getAuthUser lee de profiles)
  return updatedResponse;
};

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - Archivos con extensión (.png, .jpg, .svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

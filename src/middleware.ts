import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

/**
 * Middleware de proteção do painel administrativo.
 * Todas as rotas internas exigem sessão JWT válida do Professor.
 * Usuários não autenticados são redirecionados obrigatoriamente para /login.
 * API routes protegidas retornam 401 JSON; rota pública /api/auth/login liberada.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tkd_session')?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/login';

  // Se não autenticado
  if (!session) {
    if (isLoginPage) {
      const response = NextResponse.next();
      // Limpa cookie inválido/expirado caso exista
      if (token) {
        response.cookies.set('tkd_session', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        });
      }
      return response;
    }

    if (isApiRoute) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    // Redirecionamento obrigatório para /login com query from
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    const redirectResponse = NextResponse.redirect(loginUrl);
    if (token) {
      redirectResponse.cookies.set('tkd_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
    }
    return redirectResponse;
  }

  // Se autenticado tentando acessar /login -> redireciona para tela inicial /
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo, imagens públicas
     * - /api/auth/login (login endpoint público)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth/login).*)',
  ],
};

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

/**
 * Middleware de proteção do painel administrativo (Fase 2.2).
 * Todas as rotas internas exigem sessão JWT válida do Professor.
 * API routes retornam 401 JSON; páginas redirecionam para /login.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('tkd_session')?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Autenticado tentando acessar /login -> envia direto ao painel.
  if (!isApiRoute && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/alunos/:path*', '/financeiro/:path*', '/professores/:path*', '/login', '/api/:path*'],
};

import { NextResponse } from 'next/server';

/**
 * Controller REST: POST /api/auth/logout
 * Encerra a sessão do professor removendo o cookie httpOnly.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('tkd_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

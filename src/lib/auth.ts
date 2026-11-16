import { SignJWT, jwtVerify } from 'jose';

/**
 * Infraestrutura de sessão do Professor (JWT assinado com HS256 via `jose`).
 * O token é armazenado em cookie httpOnly — alunos/responsáveis não possuem acesso.
 */

export const SESSION_COOKIE = 'tkd_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas de sessão na beira do tatame

export interface SessionPayload {
  sub: string; // id do professor autenticado
  nome: string;
  email: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET ausente ou fraco. Configure o arquivo .env.');
  }
  return new TextEncoder().encode(secret);
}

/** Gera o JWT de sessão assinado para o professor autenticado. */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ nome: payload.nome, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

/** Verifica e decodifica o token de sessão. Retorna null se inválido/expirado. */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      nome: String(payload.nome ?? ''),
      email: String(payload.email ?? ''),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};

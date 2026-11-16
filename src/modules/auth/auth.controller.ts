import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loginRequestSchema } from './auth.dto';
import { AuthService } from './auth.service';
import { DomainError } from '@/lib/errors';

/**
 * Controller (API Route) — recebe a requisição, valida o DTO Zod e delega
 * ao Service. Nenhuma regra de negócio aqui (RULES.md §1.1).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto: LoginRequestDTOAlias = loginRequestSchema.parse(body);

    const { token, session } = await new AuthService().login(dto);

    const response = NextResponse.json({ ok: true, professor: session });
    // Sessão em cookie httpOnly gerenciado pelo middleware do painel.
    response.cookies.set('tkd_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados de acesso inválidos.', details: error.flatten().fieldErrors },
        { status: 422 },
      );
    }
    return NextResponse.json({ error: 'Falha interna na autenticação.' }, { status: 500 });
  }
}

type LoginRequestDTOAlias = z.infer<typeof loginRequestSchema>;

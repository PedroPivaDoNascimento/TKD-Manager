import bcrypt from 'bcryptjs';
import { AuthDAO } from './auth.dao';
import { LoginRequestDTO } from './auth.dto';
import { createSessionToken, SessionPayload } from '@/lib/auth';
import { DomainError } from '@/lib/errors';

/**
 * Service Layer do módulo de Autenticação (regra de negócio):
 * validação de senha com bcryptjs + geração de sessão JWT.
 */
export class AuthService {
  constructor(private readonly dao: AuthDAO = new AuthDAO()) {}

  async login(dto: LoginRequestDTO): Promise<{ token: string; session: SessionPayload }> {
    const professor = await this.dao.findProfessorByEmail(dto.email);

    // Mensagem genérica para não revelar se o e-mail existe (segurança).
    if (!professor || !(await bcrypt.compare(dto.senha, professor.senhaHash))) {
      throw new DomainError('Credenciais inválidas.', 401);
    }
    if (!professor.ativo) {
      throw new DomainError('Acesso desativado para este professor.', 403);
    }

    const session: SessionPayload = {
      sub: professor.id,
      nome: professor.nome,
      email: professor.email,
    };
    const token = await createSessionToken(session);
    return { token, session };
  }
}

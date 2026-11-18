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
    let professor = await this.dao.findProfessorByEmail(dto.email);

    // Sincronização automática com credenciais mestre do .env caso correspondam ao MASTER_EMAIL
    const masterEmail = process.env.MASTER_EMAIL;
    const masterPassword = process.env.MASTER_PASSWORD;

    if (masterEmail && dto.email.toLowerCase() === masterEmail.toLowerCase()) {
      if (masterPassword && dto.senha === masterPassword) {
        if (!professor) {
          const senhaHash = await bcrypt.hash(masterPassword, 10);
          professor = await this.dao.createProfessor({
            nome: 'Mestre Alexandre Miguetti',
            email: masterEmail,
            senhaHash,
            graduacao: 'Faixa Preta 5º Dan',
            ativo: true,
          });
        } else {
          // Garante sincronia do hash caso a senha no .env tenha sido alterada
          const match = await bcrypt.compare(masterPassword, professor.senhaHash);
          if (!match) {
            const senhaHash = await bcrypt.hash(masterPassword, 10);
            professor = await this.dao.updateProfessorPassword(professor.id, senhaHash);
          }
        }
      }
    }

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

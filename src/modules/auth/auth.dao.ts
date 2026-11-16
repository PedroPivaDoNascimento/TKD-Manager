import { prisma } from '@/lib/prisma';

/**
 * DAO de autenticação — única camada que toca o Prisma no módulo auth.
 * Nenhuma query fora de DAOs (RULES.md §1.1).
 */
export class AuthDAO {
  /** Busca o professor autenticável pelo e-mail de login. */
  async findProfessorByEmail(email: string) {
    return prisma.professor.findUnique({ where: { email } });
  }
}

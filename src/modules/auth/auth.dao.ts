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

  /** Cria o professor mestre caso ainda não exista no banco. */
  async createProfessor(data: {
    nome: string;
    email: string;
    senhaHash: string;
    graduacao: string;
    ativo: boolean;
  }) {
    return prisma.professor.create({ data });
  }

  /** Atualiza o hash de senha do professor mestre para sincronizar com o .env. */
  async updateProfessorPassword(id: string, senhaHash: string) {
    return prisma.professor.update({
      where: { id },
      data: { senhaHash },
    });
  }
}

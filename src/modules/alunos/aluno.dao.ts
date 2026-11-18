import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AlunoQueryDTO } from './aluno.dto';

/**
 * DAO de Alunos — todas as interações com o Prisma deste módulo (RULES.md §1.1).
 */
export class AlunoDAO {
  readonly alunoInclude = {
    responsavel: true,
  } satisfies Prisma.AlunoInclude;

  async findByMatricula(matricula: string) {
    return prisma.aluno.findUnique({
      where: { matricula },
      include: this.alunoInclude,
    });
  }

  async findById(id: string) {
    return prisma.aluno.findUnique({ where: { id }, include: this.alunoInclude });
  }

  async findAll(query: AlunoQueryDTO = {}) {
    const where: Prisma.AlunoWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.faixa) where.faixaAtual = query.faixa;
    if (query.busca) {
      where.OR = [
        { matricula: { contains: query.busca, mode: 'insensitive' } },
        { nome: { contains: query.busca, mode: 'insensitive' } },
      ];
    }
    return prisma.aluno.findMany({
      where,
      include: this.alunoInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Lista alunos ATIVOS com dados de contato para disparo de cobrança. */
  async findActiveForBilling() {
    return prisma.aluno.findMany({
      where: { status: 'ATIVO' },
      include: this.alunoInclude,
      orderBy: { nome: 'asc' },
    });
  }

  async create(data: Prisma.AlunoUncheckedCreateInput) {
    return prisma.aluno.create({ data, include: this.alunoInclude });
  }

  async update(id: string, data: Prisma.AlunoUncheckedUpdateInput) {
    return prisma.aluno.update({ where: { id }, data, include: this.alunoInclude });
  }

  async delete(id: string) {
    return prisma.aluno.delete({ where: { id } });
  }

  async countActive(): Promise<number> {
    return prisma.aluno.count({ where: { status: 'ATIVO' } });
  }

  async countTotal(): Promise<number> {
    return prisma.aluno.count();
  }

  /** Cria um responsável legal vinculado a um aluno menor de idade. */
  async createResponsavel(data: Prisma.ResponsavelUncheckedCreateInput) {
    return prisma.responsavel.create({ data });
  }

  async findResponsavelById(id: string) {
    return prisma.responsavel.findUnique({ where: { id } });
  }
}

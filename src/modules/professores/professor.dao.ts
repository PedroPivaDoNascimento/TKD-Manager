import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** DAO do módulo Professores — queries Prisma isoladas aqui (RULES.md §1.1). */
export class ProfessorDAO {
  async findAll() {
    return prisma.professor.findMany({
      orderBy: { nome: 'asc' },
      include: { _count: { select: { alunosCaptados: true } } },
    });
  }

  async findById(id: string) {
    return prisma.professor.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.professor.findUnique({ where: { email } });
  }

  async create(data: Prisma.ProfessorCreateInput) {
    return prisma.professor.create({ data });
  }

  async update(id: string, data: Prisma.ProfessorUpdateInput) {
    return prisma.professor.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.professor.delete({ where: { id } });
  }
}

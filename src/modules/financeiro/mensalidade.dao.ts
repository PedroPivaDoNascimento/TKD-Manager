import { Prisma, StatusMensalidade } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { MensalidadeQueryDTO } from './mensalidade.dto';

export class MensalidadeDAO {
  readonly includeAluno = {
    aluno: {
      include: {
        responsavel: true,
      },
    },
  } satisfies Prisma.MensalidadeInclude;

  async findById(id: string) {
    return prisma.mensalidade.findUnique({
      where: { id },
      include: this.includeAluno,
    });
  }

  async findByAlunoAndCompetencia(alunoId: string, competencia: string) {
    return prisma.mensalidade.findFirst({
      where: {
        alunoId,
        competencia,
      },
      include: this.includeAluno,
    });
  }

  async findAll(query: MensalidadeQueryDTO = {}) {
    const where: Prisma.MensalidadeWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.competencia) {
      where.competencia = query.competencia;
    }
    if (query.alunoId) {
      where.alunoId = query.alunoId;
    }

    return prisma.mensalidade.findMany({
      where,
      include: this.includeAluno,
      orderBy: [{ vencimento: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(data: Prisma.MensalidadeUncheckedCreateInput) {
    return prisma.mensalidade.create({
      data,
      include: this.includeAluno,
    });
  }

  async createMany(data: Prisma.MensalidadeCreateManyInput[]) {
    return prisma.mensalidade.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async update(id: string, data: Prisma.MensalidadeUncheckedUpdateInput) {
    return prisma.mensalidade.update({
      where: { id },
      data,
      include: this.includeAluno,
    });
  }

  async updateStatus(id: string, status: StatusMensalidade, pagoEm?: Date | null) {
    return prisma.mensalidade.update({
      where: { id },
      data: {
        status,
        pagoEm: status === 'PAGO' ? pagoEm ?? new Date() : null,
      },
      include: this.includeAluno,
    });
  }

  async delete(id: string) {
    return prisma.mensalidade.delete({
      where: { id },
    });
  }

  async updateOverdueStatus() {
    const today = new Date();
    // Atualiza para VENCIDO onde vencimento < hoje e status é PENDENTE
    return prisma.mensalidade.updateMany({
      where: {
        status: 'PENDENTE',
        vencimento: {
          lt: today,
        },
      },
      data: {
        status: 'VENCIDO',
      },
    });
  }

  async getFinancialSummary(competencia?: string) {
    const where: Prisma.MensalidadeWhereInput = competencia ? { competencia } : {};

    const [totalArrecadado, totalPendente, totalVencido, countPagos, countPendentes, countVencidos] =
      await Promise.all([
        prisma.mensalidade.aggregate({
          where: { ...where, status: 'PAGO' },
          _sum: { valorCents: true },
        }),
        prisma.mensalidade.aggregate({
          where: { ...where, status: 'PENDENTE' },
          _sum: { valorCents: true },
        }),
        prisma.mensalidade.aggregate({
          where: { ...where, status: 'VENCIDO' },
          _sum: { valorCents: true },
        }),
        prisma.mensalidade.count({ where: { ...where, status: 'PAGO' } }),
        prisma.mensalidade.count({ where: { ...where, status: 'PENDENTE' } }),
        prisma.mensalidade.count({ where: { ...where, status: 'VENCIDO' } }),
      ]);

    return {
      totalArrecadadoCents: totalArrecadado._sum.valorCents || 0,
      totalPendenteCents: totalPendente._sum.valorCents || 0,
      totalVencidoCents: totalVencido._sum.valorCents || 0,
      countPagos,
      countPendentes,
      countVencidos,
    };
  }
}

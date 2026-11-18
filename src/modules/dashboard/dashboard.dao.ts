import { prisma } from '@/lib/prisma';

export interface AlunosPorFaixa {
  faixa: string;
  total: number;
}

export class DashboardDAO {
  async getTotalAlunos(): Promise<{ total: number; ativos: number; inativos: number }> {
    const [total, ativos, inativos] = await Promise.all([
      prisma.aluno.count(),
      prisma.aluno.count({ where: { status: 'ATIVO' } }),
      prisma.aluno.count({ where: { status: 'INATIVO' } }),
    ]);

    return { total, ativos, inativos };
  }

  async getAlunosPorFaixa(): Promise<AlunosPorFaixa[]> {
    const agrupado = await prisma.aluno.groupBy({
      by: ['faixaAtual'],
      _count: {
        id: true,
      },
      orderBy: {
        faixaAtual: 'asc',
      },
    });

    return agrupado.map((item) => ({
      faixa: item.faixaAtual,
      total: item._count.id,
    }));
  }
}

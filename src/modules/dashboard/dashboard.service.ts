import { DashboardDAO, AlunosPorFaixa } from './dashboard.dao';
import { MensalidadeDAO } from '../financeiro/mensalidade.dao';

export interface DashboardOverview {
  kpis: {
    totalAlunos: number;
    alunosAtivos: number;
    alunosInativos: number;
    totalArrecadadoCents: number;
    totalPendenteCents: number;
    totalVencidoCents: number;
    inadimplenciaCount: number;
  };
  alunosPorFaixa: AlunosPorFaixa[];
}

export class DashboardService {
  constructor(
    private readonly dashboardDAO = new DashboardDAO(),
    private readonly mensalidadeDAO = new MensalidadeDAO()
  ) {}

  async getOverview(competencia?: string): Promise<DashboardOverview> {
    await this.mensalidadeDAO.updateOverdueStatus();

    const [alunosStats, alunosPorFaixa, financeiro] =
      await Promise.all([
        this.dashboardDAO.getTotalAlunos(),
        this.dashboardDAO.getAlunosPorFaixa(),
        this.mensalidadeDAO.getFinancialSummary(competencia),
      ]);

    return {
      kpis: {
        totalAlunos: alunosStats.total,
        alunosAtivos: alunosStats.ativos,
        alunosInativos: alunosStats.inativos,
        totalArrecadadoCents: financeiro.totalArrecadadoCents,
        totalPendenteCents: financeiro.totalPendenteCents,
        totalVencidoCents: financeiro.totalVencidoCents,
        inadimplenciaCount: financeiro.countVencidos,
      },
      alunosPorFaixa,
    };
  }
}

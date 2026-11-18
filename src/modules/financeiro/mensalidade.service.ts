import { MensalidadeDAO } from './mensalidade.dao';
import { AlunoDAO } from '../alunos/aluno.dao';
import { TemplateDAO } from '../configuracoes/template.dao';
import {
  MensalidadeCreateDTO,
  MensalidadeQueryDTO,
  MensalidadeUpdateDTO,
  MensalidadeUpdateStatusDTO,
  MensalidadeEmMassaDTO,
  GerarFolhaDTO,
  CobrancaRequestDTO,
} from './mensalidade.dto';
import { ICobrancaStrategy, CobrancaLinkResult } from './strategies/cobranca.interface';
import { WhatsAppLinkStrategy } from './strategies/whatsapp-link.strategy';
import { NotFoundError, ValidationError, ConflictError } from '@/lib/errors';
import { StatusMensalidade } from '@prisma/client';

export class MensalidadeService {
  constructor(
    private readonly mensalidadeDAO = new MensalidadeDAO(),
    private readonly alunoDAO = new AlunoDAO(),
    private readonly templateDAO = new TemplateDAO(),
    private readonly cobrancaStrategy: ICobrancaStrategy = new WhatsAppLinkStrategy()
  ) {}

  async findById(id: string) {
    const mensalidade = await this.mensalidadeDAO.findById(id);
    if (!mensalidade) {
      throw new NotFoundError('Mensalidade não encontrada.');
    }
    return mensalidade;
  }

  async list(query: MensalidadeQueryDTO = {}) {
    // Atualiza automaticamente as mensalidades vencidas
    await this.mensalidadeDAO.updateOverdueStatus();
    return this.mensalidadeDAO.findAll(query);
  }

  async create(dto: MensalidadeCreateDTO) {
    const aluno = await this.alunoDAO.findById(dto.alunoId);
    if (!aluno) {
      throw new NotFoundError('Aluno não encontrado para a mensalidade.');
    }

    const hoje = new Date();
    const status: StatusMensalidade = dto.vencimento < hoje ? 'VENCIDO' : 'PENDENTE';

    return this.mensalidadeDAO.create({
      alunoId: dto.alunoId,
      competencia: dto.competencia,
      valorCents: dto.valorCents,
      vencimento: dto.vencimento,
      status,
    });
  }

  async update(id: string, dto: MensalidadeUpdateDTO) {
    const existente = await this.mensalidadeDAO.findById(id);
    if (!existente) {
      throw new NotFoundError('Mensalidade não encontrada.');
    }

    const hoje = new Date();
    let status = dto.status ?? existente.status;
    let pagoEm = dto.pagoEm !== undefined ? dto.pagoEm : existente.pagoEm;

    if (dto.vencimento && !dto.status && status !== 'PAGO') {
      status = dto.vencimento < hoje ? 'VENCIDO' : 'PENDENTE';
    }

    if (dto.status === 'PAGO' && !pagoEm) {
      pagoEm = new Date();
    } else if (dto.status && dto.status !== 'PAGO') {
      pagoEm = null;
    }

    return this.mensalidadeDAO.update(id, {
      ...(dto.valorCents !== undefined && { valorCents: dto.valorCents }),
      ...(dto.vencimento !== undefined && { vencimento: dto.vencimento }),
      ...(dto.competencia !== undefined && { competencia: dto.competencia }),
      status,
      pagoEm,
    });
  }

  async updateStatus(id: string, dto: MensalidadeUpdateStatusDTO) {
    const existente = await this.mensalidadeDAO.findById(id);
    if (!existente) {
      throw new NotFoundError('Mensalidade não encontrada.');
    }

    return this.mensalidadeDAO.updateStatus(id, dto.status);
  }

  async delete(id: string) {
    const existente = await this.mensalidadeDAO.findById(id);
    if (!existente) {
      throw new NotFoundError('Mensalidade não encontrada.');
    }
    return this.mensalidadeDAO.delete(id);
  }

  /**
   * Criação de mensalidades em massa para todos os alunos ou alunos específicos selecionados,
   * utilizando automaticamente o valor individual da mensalidade de cada aluno.
   * Suporta lançamento único ou recorrente (N meses).
   */
  async criarMensalidadesEmMassa(dto: MensalidadeEmMassaDTO) {
    let alunosAlvo: any[] = [];

    if (dto.alunoIds === 'ALL') {
      alunosAlvo = await this.alunoDAO.findActiveForBilling();
    } else {
      const todos = await this.alunoDAO.findAll();
      const setIds = new Set(dto.alunoIds);
      alunosAlvo = todos.filter((a) => setIds.has(a.id));
    }

    if (alunosAlvo.length === 0) {
      return { totalCriadas: 0, mensagem: 'Nenhum aluno encontrado para os critérios selecionados.' };
    }

    const mesesParaGerar = dto.tipo === 'RECORRENTE' ? Math.max(1, dto.quantidadeMeses) : 1;
    const [anoIniStr, mesIniStr] = dto.competenciaInicial.split('-');
    const anoBase = parseInt(anoIniStr, 10);
    const mesBase = parseInt(mesIniStr, 10) - 1; // 0-indexed

    const registros: any[] = [];
    const hoje = new Date();

    for (let i = 0; i < mesesParaGerar; i++) {
      const dataCursor = new Date(anoBase, mesBase + i, dto.diaVencimento);
      const competencia = `${dataCursor.getFullYear()}-${String(dataCursor.getMonth() + 1).padStart(2, '0')}`;
      const status: StatusMensalidade = dataCursor < hoje ? 'VENCIDO' : 'PENDENTE';

      for (const aluno of alunosAlvo) {
        registros.push({
          alunoId: aluno.id,
          competencia,
          valorCents: aluno.valorMensalidadeCents, // Utiliza o valor configurado no perfil do aluno
          vencimento: dataCursor,
          status,
        });
      }
    }

    const resultado = await this.mensalidadeDAO.createMany(registros);
    return {
      totalCriadas: resultado.count,
      mesesGerados: mesesParaGerar,
      totalAlunos: alunosAlvo.length,
      competenciaInicial: dto.competenciaInicial,
    };
  }

  /**
   * Gera a folha de mensalidades do mês para todos os alunos ativos da academia (legado)
   */
  async gerarFolhaMensal(dto: GerarFolhaDTO) {
    return this.criarMensalidadesEmMassa({
      alunoIds: 'ALL',
      competenciaInicial: dto.competencia,
      diaVencimento: dto.diaVencimento,
      tipo: 'UNICA',
      quantidadeMeses: 1,
    });
  }

  /**
   * Resumo financeiro de arrecadação e inadimplência
   */
  async getFinancialSummary(competencia?: string) {
    await this.mensalidadeDAO.updateOverdueStatus();
    return this.mensalidadeDAO.getFinancialSummary(competencia);
  }

  /**
   * Gera links wa.me utilizando Strategy Pattern
   * Regra: Se o aluno for menor ou possuir responsável vinculado, direcionar cobrança ao responsável.
   */
  async gerarLinksCobranca(dto: CobrancaRequestDTO): Promise<CobrancaLinkResult[]> {
    await this.mensalidadeDAO.updateOverdueStatus();

    let mensalidades: any[] = [];

    if (dto.mensalidadeId) {
      const m = await this.mensalidadeDAO.findById(dto.mensalidadeId);
      if (!m) {
        throw new NotFoundError('Mensalidade não encontrada.');
      }
      mensalidades = [m];
    } else if (dto.competencia) {
      mensalidades = await this.mensalidadeDAO.findAll({
        competencia: dto.competencia,
        status: dto.apenasInadimplentes ? undefined : undefined,
      });

      if (dto.apenasInadimplentes) {
        mensalidades = mensalidades.filter(
          (m) => m.status === 'PENDENTE' || m.status === 'VENCIDO'
        );
      }
    }

    let templateTexto = dto.templateTexto;
    if (!templateTexto && dto.templateId) {
      const t = await this.templateDAO.findById(dto.templateId);
      if (t) templateTexto = t.corpo;
    }

    const links: CobrancaLinkResult[] = [];

    for (const m of mensalidades) {
      const aluno = m.aluno;
      const resp = aluno.responsavel;

      // Determinar destinatário
      let telefoneDestino = '';
      let nomeDestino = '';
      let isResponsavel = false;

      if (resp && resp.telefone) {
        telefoneDestino = resp.telefone;
        nomeDestino = resp.nome;
        isResponsavel = true;
      } else if (aluno.telefone) {
        telefoneDestino = aluno.telefone;
        nomeDestino = aluno.nome;
        isResponsavel = false;
      }

      if (!telefoneDestino) {
        // Aluno e responsável sem telefone cadastrado
        continue;
      }

      const link = this.cobrancaStrategy.gerarLink(
        {
          id: m.id,
          alunoNome: aluno.nome,
          competencia: m.competencia,
          valorCents: m.valorCents,
          vencimento: m.vencimento,
          status: m.status,
          destinatario: {
            nomeAluno: aluno.nome,
            nomeDestinatario: nomeDestino,
            telefone: telefoneDestino,
            isResponsavel,
            parentesco: resp?.parentesco,
          },
        },
        {
          template: dto.mensagemTemplate,
          templateTexto,
          mensagemPersonalizada: dto.mensagemPersonalizada,
        }
      );

      links.push(link);
    }

    return links;
  }
}

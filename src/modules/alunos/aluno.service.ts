import { AlunoDAO } from './aluno.dao';
import { AlunoCreateDTO, AlunoQueryDTO, AlunoUpdateDTO } from './aluno.dto';
import { DomainError } from '@/lib/errors';
import { isMinor } from '@/lib/utils';

/**
 * Service Layer de Alunos — regras de negócio:
 * - unicidade da matrícula;
 * - registro de quem captou/efetuou a matrícula;
 * - obrigatoriedade de responsável para MENORES de 18 anos;
 * - valores monetários sempre inteiros em centavos.
 */
export class AlunoService {
  constructor(private readonly dao: AlunoDAO = new AlunoDAO()) {}

  async createAluno(dto: AlunoCreateDTO) {
    const existing = await this.dao.findByMatricula(dto.matricula);
    if (existing) {
      throw new DomainError(`A matrícula "${dto.matricula}" já está em uso por outro aluno.`, 409);
    }

    // Regra PRD §4.2: vínculo com responsável é OBRIGATÓRIO se menor de idade.
    let responsavelId = dto.idResponsavel ?? dto.responsavel?.id ?? null;
    if (isMinor(dto.dataNascimento)) {
      if (dto.responsavel && !responsavelId) {
        const criado = await this.dao.createResponsavel({
          nome: dto.responsavel.nome,
          cpf: dto.responsavel.cpf || null,
          telefone: dto.responsavel.telefone,
          parentesco: dto.responsavel.parentesco,
        });
        responsavelId = criado.id;
      }
      if (!responsavelId) {
        throw new DomainError(
          'Aluno menor de idade exige cadastro de responsável (nome e telefone).',
          422,
        );
      }
    }

    return this.dao.create({
      matricula: dto.matricula,
      nome: dto.nome,
      dataNascimento: dto.dataNascimento,
      sexo: dto.sexo ?? null,
      telefone: dto.telefone || null,
      email: dto.email || null,
      endereco: dto.endereco || null,
      faixaAtual: dto.faixaAtual,
      dataUltimoExame: dto.dataUltimoExame ?? null,
      status: dto.status,
      captadoPorNome: dto.captadoPorNome || null,
      captadoPorId: dto.captadoPorId || null,
      valorMensalidadeCents: dto.valorMensalidadeCents,
      responsavelId,
    });
  }

  async updateAluno(id: string, dto: AlunoUpdateDTO) {
    const aluno = await this.dao.findById(id);
    if (!aluno) throw new DomainError('Aluno não encontrado.', 404);

    const dataNascimento = dto.dataNascimento ?? aluno.dataNascimento;
    let responsavelId = dto.idResponsavel ?? dto.responsavel?.id ?? aluno.responsavelId;

    if (isMinor(dataNascimento)) {
      if (dto.responsavel && !aluno.responsavelId && !dto.idResponsavel) {
        const criado = await this.dao.createResponsavel({
          nome: dto.responsavel.nome,
          cpf: dto.responsavel.cpf || null,
          telefone: dto.responsavel.telefone,
          parentesco: dto.responsavel.parentesco,
        });
        responsavelId = criado.id;
      }
      if (!responsavelId) {
        throw new DomainError('Aluno menor de idade exige responsável vinculado.', 422);
      }
    }

    return this.dao.update(id, {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.dataNascimento !== undefined && { dataNascimento: dto.dataNascimento }),
      ...(dto.sexo !== undefined && { sexo: dto.sexo }),
      ...(dto.telefone !== undefined && { telefone: dto.telefone || null }),
      ...(dto.email !== undefined && { email: dto.email || null }),
      ...(dto.endereco !== undefined && { endereco: dto.endereco || null }),
      ...(dto.faixaAtual !== undefined && { faixaAtual: dto.faixaAtual }),
      ...(dto.dataUltimoExame !== undefined && { dataUltimoExame: dto.dataUltimoExame }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.captadoPorNome !== undefined && { captadoPorNome: dto.captadoPorNome || null }),
      ...(dto.captadoPorId !== undefined && { captadoPorId: dto.captadoPorId || null }),
      ...(dto.valorMensalidadeCents !== undefined && {
        valorMensalidadeCents: dto.valorMensalidadeCents,
      }),
      responsavelId,
    });
  }

  async listAlunos(query: AlunoQueryDTO) {
    return this.dao.findAll(query);
  }

  async getAluno(id: string) {
    const aluno = await this.dao.findById(id);
    if (!aluno) throw new DomainError('Aluno não encontrado.', 404);
    return aluno;
  }

  /** Próxima matrícula sequencial sugerida no padrão MT-ANO-NNNN. */
  async suggestNextMatricula(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `MT-${year}-`;
    const alunos = await this.dao.findAll({ busca: prefix });
    const maxSeq = alunos.reduce((acc, a) => {
      const seq = Number(a.matricula.replace(prefix, ''));
      return Number.isNaN(seq) ? acc : Math.max(acc, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;
  }
}

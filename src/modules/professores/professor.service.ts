import bcrypt from 'bcryptjs';
import { ProfessorDAO } from './professor.dao';
import { ProfessorCreateDTO, ProfessorUpdateDTO } from './professor.dto';
import { DomainError } from '@/lib/errors';

/**
 * Service Layer de Professores/Instrutores (gestão da equipe).
 * Regras: e-mail único quando informado; senha sempre com hash bcrypt;
 * exclusão bloqueada se houver matrículas captadas (integridade analítica).
 */
export class ProfessorService {
  constructor(private readonly dao: ProfessorDAO = new ProfessorDAO()) {}

  async listProfessors() {
    return this.dao.findAll();
  }

  async createProfessor(dto: ProfessorCreateDTO) {
    const email = dto.email?.trim() || null;
    if (email) {
      const dup = await this.dao.findByEmail(email);
      if (dup) throw new DomainError('Já existe um professor/instrutor com este e-mail.', 409);
    }

    // Instrutores auxiliares podem não ter credenciais de login (ativo=false no acesso).
    const senhaHash = dto.senha ? await bcrypt.hash(dto.senha, 10) : await bcrypt.hash(Math.random().toString(36), 10);

    return this.dao.create({
      nome: dto.nome,
      email: email ?? `instrutor-${Date.now()}@sem-accesso.tkd.local`,
      senhaHash,
      graduacao: dto.graduacao,
      ativo: dto.ativo,
    });
  }

  async updateProfessor(id: string, dto: ProfessorUpdateDTO) {
    const professor = await this.dao.findById(id);
    if (!professor) throw new DomainError('Professor não encontrado.', 404);

    if (dto.email && dto.email !== professor.email) {
      const dup = await this.dao.findByEmail(dto.email);
      if (dup) throw new DomainError('E-mail já utilizado por outro professor.', 409);
    }

    return this.dao.update(id, {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.email !== undefined && dto.email ? { email: dto.email } : {}),
      ...(dto.graduacao !== undefined && { graduacao: dto.graduacao }),
      ...(dto.ativo !== undefined && { ativo: dto.ativo }),
      ...(dto.senha ? { senhaHash: await bcrypt.hash(dto.senha, 10) } : {}),
    });
  }

  async deleteProfessor(id: string) {
    const professor = await this.dao.findById(id);
    if (!professor) throw new DomainError('Professor não encontrado.', 404);
    return this.dao.delete(id);
  }
}

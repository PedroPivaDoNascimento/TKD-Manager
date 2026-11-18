import { TemplateDAO } from './template.dao';
import {
  MensagemTemplateCreateDTO,
  MensagemTemplateUpdateDTO,
} from './template.dto';
import { NotFoundError } from '@/lib/errors';

export class TemplateService {
  constructor(private readonly dao: TemplateDAO = new TemplateDAO()) {}

  async listTemplates() {
    await this.dao.ensureDefaultTemplates();
    return this.dao.findAll();
  }

  async getTemplate(id: string) {
    const t = await this.dao.findById(id);
    if (!t) throw new NotFoundError('Template não encontrado.');
    return t;
  }

  async createTemplate(dto: MensagemTemplateCreateDTO) {
    return this.dao.create({
      titulo: dto.titulo,
      corpo: dto.corpo,
      isDefault: dto.isDefault ?? false,
    });
  }

  async updateTemplate(id: string, dto: MensagemTemplateUpdateDTO) {
    const existing = await this.dao.findById(id);
    if (!existing) throw new NotFoundError('Template não encontrado.');

    return this.dao.update(id, {
      ...(dto.titulo !== undefined && { titulo: dto.titulo }),
      ...(dto.corpo !== undefined && { corpo: dto.corpo }),
      ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
    });
  }

  async deleteTemplate(id: string) {
    const existing = await this.dao.findById(id);
    if (!existing) throw new NotFoundError('Template não encontrado.');
    return this.dao.delete(id);
  }
}

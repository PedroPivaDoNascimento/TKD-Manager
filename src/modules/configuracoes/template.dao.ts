import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class TemplateDAO {
  async findAll() {
    return prisma.mensagemTemplate.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findById(id: string) {
    return prisma.mensagemTemplate.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.MensagemTemplateCreateInput) {
    if (data.isDefault) {
      await prisma.mensagemTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }
    return prisma.mensagemTemplate.create({ data });
  }

  async update(id: string, data: Prisma.MensagemTemplateUpdateInput) {
    if (data.isDefault) {
      await prisma.mensagemTemplate.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }
    return prisma.mensagemTemplate.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.mensagemTemplate.delete({
      where: { id },
    });
  }

  async ensureDefaultTemplates() {
    const count = await prisma.mensagemTemplate.count();
    if (count === 0) {
      await prisma.mensagemTemplate.createMany({
        data: [
          {
            titulo: 'Lembrete Amigável',
            corpo:
              'Olá, {destinatario}! Tudo bem? Passando para lembrar da mensalidade do(a) aluno(a) {nome_aluno} no valor de {valor} com vencimento para {vencimento} (ref. {competencia}). Centro de Treinamento Miguetti Team agradece! OSS! 🥋',
            isDefault: true,
          },
          {
            titulo: 'Cobrança no Vencimento',
            corpo:
              'Olá, {destinatario}! Mensagem do Centro de Treinamento Miguetti Team. Lembramos que a mensalidade do aluno(a) {nome_aluno} ({valor}) referente a {competencia} vence em {vencimento}. Fique em dia com os treinos! Dúvidas estamos à disposição. OSS! 🥋',
            isDefault: false,
          },
          {
            titulo: 'Aviso de Vencimento / Urgente',
            corpo:
              'Olá, {destinatario}! Constatamos que a mensalidade do(a) aluno(a) {nome_aluno} ref. {competencia} ({valor}) venceu em {vencimento}. Pedimos a gentileza de regularizar para mantermos a frequência normal dos treinos. Caso já tenha realizado, favor desconsiderar. OSS! 🥋',
            isDefault: false,
          },
        ],
      });
    }
  }
}

import { z } from 'zod';

/**
 * DTOs do módulo Financeiro.
 * REGRA INEGOCIÁVEL: valores SEMPRE inteiros em CENTAVOS (RULES.md §2).
 */

export const mensalidadeCreateSchema = z.object({
  alunoId: z.string().uuid('Selecione um aluno.'),
  competencia: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Competência deve estar no formato YYYY-MM.'),
  /** Valor em centavos (ex.: R$ 150,00 -> 15000) */
  valorCents: z.coerce
    .number()
    .int('O valor deve ser um inteiro representando centavos.')
    .positive('O valor da mensalidade deve ser maior que zero.'),
  vencimento: z.coerce.date({ required_error: 'Informe a data de vencimento.' }),
});
export type MensalidadeCreateDTO = z.infer<typeof mensalidadeCreateSchema>;

export const mensalidadeUpdateStatusSchema = z.object({
  status: z.enum(['PAGO', 'PENDENTE', 'VENCIDO']),
});
export type MensalidadeUpdateStatusDTO = z.infer<typeof mensalidadeUpdateStatusSchema>;

/** Lança mensalidades em lote para todos os alunos ativos de uma competência. */
export const gerarFolhaSchema = z.object({
  competencia: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Competência deve estar no formato YYYY-MM.'),
  diaVencimento: z.coerce
    .number()
    .int()
    .min(1)
    .max(28)
    .default(10),
});
export type GerarFolhaDTO = z.infer<typeof gerarFolhaSchema>;

export const mensalidadeQuerySchema = z.object({
  status: z.enum(['PAGO', 'PENDENTE', 'VENCIDO']).optional(),
  competencia: z.string().optional(),
  alunoId: z.string().uuid().optional(),
});
export type MensalidadeQueryDTO = z.infer<typeof mensalidadeQuerySchema>;

/** Payload do disparo de cobrança via WhatsApp (Strategy Pattern). */
export const cobrancaRequestSchema = z
  .object({
    /** Cobrança individual por mensalidade */
    mensalidadeId: z.string().uuid().optional(),
    /** Cobrança em lote para todos os inadimplentes de uma competência */
    competencia: z.string().optional(),
    /** Somente inadimplentes (PENDENTE/VENCIDO) — padrão true */
    apenasInadimplentes: z.boolean().default(true),
    mensagemTemplate: z
      .enum(['LEMBRETE', 'COBRANCA', 'URGENTE'])
      .default('LEMBRETE'),
    /** Mensagem totalmente personalizada pelo professor (sobrepõe o template) */
    mensagemPersonalizada: z.string().max(600).optional(),
  })
  .refine((v) => Boolean(v.mensalidadeId) || Boolean(v.competencia), {
    message: 'Informe mensalidadeId (individual) ou competencia (em lote).',
  });
export type CobrancaRequestDTO = z.infer<typeof cobrancaRequestSchema>;

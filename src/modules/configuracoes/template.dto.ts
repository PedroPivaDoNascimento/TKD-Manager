import { z } from 'zod';

export const mensagemTemplateCreateSchema = z.object({
  titulo: z.string().min(2, 'O título deve ter pelo menos 2 caracteres.').max(100),
  corpo: z.string().min(5, 'O corpo da mensagem deve ter pelo menos 5 caracteres.').max(2000),
  isDefault: z.boolean().optional().default(false),
});
export type MensagemTemplateCreateDTO = z.infer<typeof mensagemTemplateCreateSchema>;

export const mensagemTemplateUpdateSchema = z.object({
  titulo: z.string().min(2).max(100).optional(),
  corpo: z.string().min(5).max(2000).optional(),
  isDefault: z.boolean().optional(),
});
export type MensagemTemplateUpdateDTO = z.infer<typeof mensagemTemplateUpdateSchema>;

import { z } from 'zod';

/**
 * DTOs do módulo de Professores/Instrutores.
 * Atenção: apenas o PERFIL PROFESSOR possui login; instrutores cadastrados aqui
 * podem ser não-autenticados (função "captar matrícula") — campo `ativo`.
 */
export const professorCreateSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  senha: z.string().min(6, 'Senha mínima de 6 caracteres.').optional(),
  graduacao: z.string().default('Faixa Preta 1º Dan'),
  ativo: z.boolean().default(true),
});
export type ProfessorCreateDTO = z.infer<typeof professorCreateSchema>;

export const professorUpdateSchema = professorCreateSchema.partial();
export type ProfessorUpdateDTO = z.infer<typeof professorUpdateSchema>;

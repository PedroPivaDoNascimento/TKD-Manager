import { z } from 'zod';

/**
 * DTO de autenticação — validação Zod em tempo de execução (RULES.md §1.2).
 * O acesso é EXCLUSIVO do Professor/Mestre (PRD §3); alunos e responsáveis
 * não possuem credenciais.
 */
export const loginRequestSchema = z.object({
  email: z
    .string({ required_error: 'Informe o e-mail de acesso do professor.' })
    .email('E-mail inválido.'),
  senha: z
    .string({ required_error: 'Informe a senha.' })
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>;

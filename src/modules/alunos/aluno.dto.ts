import { z } from 'zod';

/**
 * DTOs do módulo de Alunos (RULES.md §1.2):
 * - `matricula` única obrigatória;
 * - rastreio de quem efetuou/pegou a matrícula (`captadoPor`);
 * - responsável opcional no payload, mas OBRIGATÓRIO para menores de idade
 *   (regra aplicada na Service Layer).
 */

export const responsavelInputSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3, 'Nome do responsável muito curto.'),
  cpf: z.string().optional(),
  telefone: z
    .string()
    .min(10, 'Telefone inválido (DDD + número).')
    .regex(/^[\d\s()+-]+$/, 'Telefone deve conter apenas dígitos.'),
  parentesco: z.string().default('Responsável Legal'),
});

export type ResponsavelInputDTO = z.infer<typeof responsavelInputSchema>;

export const alunoCreateSchema = z
  .object({
    matricula: z
      .string({ required_error: 'A matrícula é obrigatória.' })
      .min(3, 'Matrícula muito curta.')
      .max(40),
    nome: z.string({ required_error: 'Informe o nome do aluno.' }).min(3, 'Nome muito curto.'),
    dataNascimento: z.coerce.date({ required_error: 'Informe a data de nascimento.' }),
    sexo: z.enum(['M', 'F']).optional(),
    telefone: z.string().optional(),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    endereco: z.string().optional(),
    faixaAtual: z
      .enum(['BRANCA', 'AZUL', 'AMARELA', 'VERDE', 'MARROM', 'PRETA'])
      .default('BRANCA'),
    dataUltimoExame: z.coerce.date().optional().nullable(),
    status: z.enum(['ATIVO', 'INATIVO']).default('ATIVO'),
    /** Nome livre de quem captou a matrícula (quando não é professor cadastrado) */
    captadoPorNome: z.string().optional(),
    /** Id do professor/instrutor cadastrado que pegou a matrícula */
    captadoPorId: z.string().uuid().optional().nullable(),
    /** Valor da mensalidade em centavos (Int — nunca float!) */
    valorMensalidadeCents: z.coerce.number().int('Valor deve ser inteiro em centavos.').min(0),
    responsavel: responsavelInputSchema.optional().nullable(),
    idResponsavel: z.string().uuid().optional().nullable(),
  })
  .refine((v) => Boolean(v.captadoPorNome?.trim()) || Boolean(v.captadoPorId), {
    message: 'Informe quem efetuou/pegou a matrícula (captador).',
    path: ['captadoPorNome'],
  });

export type AlunoCreateDTO = z.infer<typeof alunoCreateSchema>;

export const alunoUpdateSchema = alunoCreateSchema.partial().omit({ matricula: true });
export type AlunoUpdateDTO = z.infer<typeof alunoUpdateSchema>;

export const alunoQuerySchema = z.object({
  busca: z.string().optional(), // busca por matrícula ou nome
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
  faixa: z.enum(['BRANCA', 'AZUL', 'AMARELA', 'VERDE', 'MARROM', 'PRETA']).optional(),
});
export type AlunoQueryDTO = z.infer<typeof alunoQuerySchema>;

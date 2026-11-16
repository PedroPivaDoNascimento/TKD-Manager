/**
 * Erro de domínio lançado pela Service Layer.
 * Os Controllers (API Routes) convertem `status` em resposta HTTP — nenhuma
 * regra de negócio reside nos controllers (RULES.md §1).
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

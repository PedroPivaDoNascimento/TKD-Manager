/**
 * Erro de domínio lançado pela Service Layer.
 * Os Controllers (API Routes) convertem `statusCode` / `status` em resposta HTTP.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'DomainError';
  }

  get status(): number {
    return this.statusCode;
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Recurso não encontrado.') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = 'Conflito de dados.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string = 'Dados inválidos.') {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

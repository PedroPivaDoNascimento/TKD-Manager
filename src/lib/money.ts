/**
 * Utilitários de valor monetário.
 * REGRA INEGOCIÁVEL (RULES.md §2): valores SEMPRE em inteiros de CENTAVOS.
 * Nunca usar float/double para dinheiro.
 */

/** Formata centavos (Int) para BRL exibível: 15000 -> "R$ 150,00" */
export function formatCentsToBRL(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error('Valor monetário deve ser um inteiro representando centavos.');
  }
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Converte texto de formulário ("150,00", "R$ 150.00") para centavos (Int). */
export function parseBRLToCents(input: string | number): number {
  if (typeof input === 'number') return Math.round(input * 100);
  const normalized = input.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  if (Number.isNaN(value)) throw new Error(`Valor monetário inválido: ${input}`);
  return Math.round(value * 100);
}

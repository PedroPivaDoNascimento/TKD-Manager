/** Calcula a idade exata em anos a partir de uma data de nascimento. */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function isMinor(birthDate: Date): boolean {
  return calculateAge(birthDate) < 18;
}

/** Normaliza telefone para o formato E.164 somente dígitos exigido pelo wa.me */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length <= 11) digits = `55${digits}`; // adiciona DDI Brasil quando ausente
  return digits;
}

/** Competência YYYY-MM a partir de uma data */
export function toCompetencia(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

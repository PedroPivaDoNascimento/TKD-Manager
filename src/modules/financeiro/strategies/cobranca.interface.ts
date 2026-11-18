export interface DestinatarioCobranca {
  nomeAluno: string;
  nomeDestinatario: string;
  telefone: string; // formato internacional limpo E.164, ex: 5511999998888
  isResponsavel: boolean;
  parentesco?: string;
}

export interface MensalidadeCobrancaDados {
  id: string;
  alunoNome: string;
  competencia: string;
  valorCents: number;
  vencimento: Date;
  status: string;
  destinatario: DestinatarioCobranca;
}

export interface CobrancaLinkResult {
  mensalidadeId: string;
  alunoNome: string;
  destinatarioNome: string;
  telefone: string;
  isResponsavel: boolean;
  mensagem: string;
  whatsappUrl: string;
}

export interface ICobrancaStrategy {
  gerarLink(
    dados: MensalidadeCobrancaDados,
    options?: {
      template?: 'LEMBRETE' | 'COBRANCA' | 'URGENTE';
      mensagemPersonalizada?: string;
      templateTexto?: string;
    }
  ): CobrancaLinkResult;
}

import { formatCentsToBRL } from '@/lib/money';
import {
  ICobrancaStrategy,
  MensalidadeCobrancaDados,
  CobrancaLinkResult,
} from './cobranca.interface';

export class WhatsAppLinkStrategy implements ICobrancaStrategy {
  private normalizarTelefone(tel: string): string {
    const limpo = tel.replace(/\D/g, '');
    if (limpo.startsWith('55')) {
      return limpo;
    }
    return `55${limpo}`;
  }

  private formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(data));
  }

  gerarLink(
    dados: MensalidadeCobrancaDados,
    options?: {
      template?: 'LEMBRETE' | 'COBRANCA' | 'URGENTE';
      mensagemPersonalizada?: string;
      templateTexto?: string;
    }
  ): CobrancaLinkResult {
    const { id, alunoNome, competencia, valorCents, vencimento, destinatario } = dados;
    const valorFormatado = formatCentsToBRL(valorCents);
    const dataVencimento = this.formatarData(vencimento);
    const telefoneE164 = this.normalizarTelefone(destinatario.telefone);

    let mensagem = '';

    const replaceTags = (texto: string) => {
      return texto
        .replace(/{destinatario}/g, destinatario.nomeDestinatario)
        .replace(/{nome_aluno}/g, alunoNome)
        .replace(/{aluno}/g, alunoNome)
        .replace(/{valor}/g, valorFormatado)
        .replace(/{vencimento}/g, dataVencimento)
        .replace(/{competencia}/g, competencia);
    };

    if (options?.templateTexto && options.templateTexto.trim().length > 0) {
      mensagem = replaceTags(options.templateTexto);
    } else if (options?.mensagemPersonalizada && options.mensagemPersonalizada.trim().length > 0) {
      mensagem = replaceTags(options.mensagemPersonalizada);
    } else {
      const saudacao = `Olá, ${destinatario.nomeDestinatario}!`;
      const vinculo = destinatario.isResponsavel ? `do(a) aluno(a) *${alunoNome}*` : 'sua';

      switch (options?.template) {
        case 'URGENTE':
          mensagem = `${saudacao} Aqui é do *Centro de Treinamento Miguetti Team*. Constatamos que a mensalidade ${vinculo} ref. ${competencia} (${valorFormatado}) venceu em ${dataVencimento}. Pedimos a gentileza de regularizar o pagamento para mantermos a frequência do aluno sem interrupções. Caso já tenha realizado, favor desconsiderar. OSS! 🥋`;
          break;
        case 'COBRANCA':
          mensagem = `${saudacao} Mensagem do *Centro de Treinamento Miguetti Team*. Lembramos que a mensalidade ${vinculo} (${valorFormatado}) referente a ${competencia} está com vencimento para ${dataVencimento}. Fique em dia com seus treinos! Dúvidas estamos à disposição. OSS! 🥋`;
          break;
        case 'LEMBRETE':
        default:
          mensagem = `${saudacao} Tudo bem? Passando para lembrar da mensalidade ${vinculo} no valor de ${valorFormatado} ref. ${competencia}, com vencimento em ${dataVencimento}. Centro de Treinamento Miguetti Team agradece! OSS! 🥋`;
          break;
      }
    }

    const whatsappUrl = `https://wa.me/${telefoneE164}?text=${encodeURIComponent(mensagem)}`;

    return {
      mensalidadeId: id,
      alunoNome,
      destinatarioNome: destinatario.nomeDestinatario,
      telefone: telefoneE164,
      isResponsavel: destinatario.isResponsavel,
      mensagem,
      whatsappUrl,
    };
  }
}

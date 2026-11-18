import { NextRequest, NextResponse } from 'next/server';
import { MensalidadeService } from '@/modules/financeiro/mensalidade.service';
import {
  mensalidadeCreateSchema,
  mensalidadeQuerySchema,
  mensalidadeEmMassaSchema,
  gerarFolhaSchema,
  cobrancaRequestSchema,
} from '@/modules/financeiro/mensalidade.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const mensalidadeService = new MensalidadeService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as any) || undefined;
    const competencia = searchParams.get('competencia') || undefined;
    const alunoId = searchParams.get('alunoId') || undefined;
    const summary = searchParams.get('summary');

    if (summary === 'true') {
      const resumo = await mensalidadeService.getFinancialSummary(competencia);
      return NextResponse.json({ data: resumo });
    }

    const query = mensalidadeQuerySchema.parse({ status, competencia, alunoId });
    const mensalidades = await mensalidadeService.list(query);

    return NextResponse.json({ data: mensalidades });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota GET /api/mensalidades:', error);
    return NextResponse.json({ error: 'Erro ao listar mensalidades.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get('action');

    // Geração em massa de mensalidades (para todos ou alunos selecionados)
    if (action === 'gerar-massa') {
      const dto = mensalidadeEmMassaSchema.parse(body);
      const resultado = await mensalidadeService.criarMensalidadesEmMassa(dto);
      return NextResponse.json({
        data: resultado,
        message: `Mensalidades geradas com sucesso (${resultado.totalCriadas} criadas para ${resultado.totalAlunos} aluno(s)).`,
      });
    }

    // Geração em lote da folha de mensalidades (retrocompatível)
    if (action === 'gerar-folha') {
      const dto = gerarFolhaSchema.parse(body);
      const resultado = await mensalidadeService.gerarFolhaMensal(dto);
      return NextResponse.json({
        data: resultado,
        message: `Folha gerada com sucesso (${resultado.totalCriadas} mensalidades criadas).`,
      });
    }

    // Disparo / Geração de links de cobrança WhatsApp
    if (action === 'cobranca-whatsapp') {
      const dto = cobrancaRequestSchema.parse(body);
      const links = await mensalidadeService.gerarLinksCobranca(dto);
      return NextResponse.json({
        data: links,
        message: `${links.length} link(s) de cobrança gerados com sucesso.`,
      });
    }

    // Lançamento individual
    const dto = mensalidadeCreateSchema.parse(body);
    const mensalidade = await mensalidadeService.create(dto);

    return NextResponse.json(
      { data: mensalidade, message: 'Mensalidade lançada com sucesso.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota POST /api/mensalidades:', error);
    return NextResponse.json({ error: 'Erro ao processar mensalidade.' }, { status: 500 });
  }
}

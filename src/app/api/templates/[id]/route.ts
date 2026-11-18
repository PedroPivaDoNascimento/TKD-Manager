import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/modules/configuracoes/template.service';
import { mensagemTemplateUpdateSchema } from '@/modules/configuracoes/template.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const templateService = new TemplateService();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await templateService.getTemplate(params.id);
    return NextResponse.json({ data: template });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro GET /api/templates/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao buscar template.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dto = mensagemTemplateUpdateSchema.parse(body);
    const template = await templateService.updateTemplate(params.id, dto);

    return NextResponse.json({
      data: template,
      message: 'Template atualizado com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro PUT /api/templates/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao atualizar template.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await templateService.deleteTemplate(params.id);
    return NextResponse.json({ message: 'Template excluído com sucesso.' });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro DELETE /api/templates/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao excluir template.' }, { status: 500 });
  }
}

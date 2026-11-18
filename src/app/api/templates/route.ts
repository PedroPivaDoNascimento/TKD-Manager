import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/modules/configuracoes/template.service';
import {
  mensagemTemplateCreateSchema,
} from '@/modules/configuracoes/template.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const templateService = new TemplateService();

export async function GET() {
  try {
    const templates = await templateService.listTemplates();
    return NextResponse.json({ data: templates });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro GET /api/templates:', error);
    return NextResponse.json({ error: 'Erro ao listar templates.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = mensagemTemplateCreateSchema.parse(body);
    const template = await templateService.createTemplate(dto);

    return NextResponse.json(
      { data: template, message: 'Template de mensagem criado com sucesso.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro POST /api/templates:', error);
    return NextResponse.json({ error: 'Erro ao salvar template.' }, { status: 500 });
  }
}

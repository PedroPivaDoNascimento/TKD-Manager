import { NextRequest, NextResponse } from 'next/server';
import { MensalidadeService } from '@/modules/financeiro/mensalidade.service';
import {
  mensalidadeUpdateStatusSchema,
  mensalidadeUpdateSchema,
} from '@/modules/financeiro/mensalidade.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const mensalidadeService = new MensalidadeService();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mensalidade = await mensalidadeService.findById(params.id);
    return NextResponse.json({ data: mensalidade });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro GET /api/mensalidades/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao buscar mensalidade.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dto = mensalidadeUpdateSchema.parse(body);
    const mensalidade = await mensalidadeService.update(params.id, dto);

    return NextResponse.json({
      data: mensalidade,
      message: 'Mensalidade atualizada com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro PUT /api/mensalidades/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao atualizar mensalidade.' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dto = mensalidadeUpdateStatusSchema.parse(body);
    const mensalidade = await mensalidadeService.updateStatus(params.id, dto);

    return NextResponse.json({
      data: mensalidade,
      message: 'Status da mensalidade atualizado com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro PATCH /api/mensalidades/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao atualizar mensalidade.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await mensalidadeService.delete(params.id);
    return NextResponse.json({ message: 'Mensalidade excluída com sucesso.' });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro DELETE /api/mensalidades/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao excluir mensalidade.' }, { status: 500 });
  }
}

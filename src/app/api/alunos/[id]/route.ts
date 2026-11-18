import { NextRequest, NextResponse } from 'next/server';
import { AlunoService } from '@/modules/alunos/aluno.service';
import { alunoUpdateSchema } from '@/modules/alunos/aluno.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const alunoService = new AlunoService();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const aluno = await alunoService.getAluno(params.id);
    return NextResponse.json({ data: aluno });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro GET /api/alunos/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao buscar aluno.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dto = alunoUpdateSchema.parse(body);
    const aluno = await alunoService.updateAluno(params.id, dto);

    return NextResponse.json({ data: aluno, message: 'Aluno atualizado com sucesso.' });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro PUT /api/alunos/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao atualizar aluno.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await alunoService.deleteAluno(params.id);
    return NextResponse.json({ message: 'Aluno excluído com sucesso.' });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro DELETE /api/alunos/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao excluir aluno.' }, { status: 500 });
  }
}

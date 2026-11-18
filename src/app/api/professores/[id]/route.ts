import { NextRequest, NextResponse } from 'next/server';
import { ProfessorService } from '@/modules/professores/professor.service';
import { professorUpdateSchema } from '@/modules/professores/professor.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const professorService = new ProfessorService();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dto = professorUpdateSchema.parse(body);
    const professor = await professorService.updateProfessor(params.id, dto);

    return NextResponse.json({
      data: professor,
      message: 'Professor atualizado com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro PUT /api/professores/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao atualizar professor.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await professorService.deleteProfessor(params.id);
    return NextResponse.json({ message: 'Professor excluído com sucesso.' });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`Erro DELETE /api/professores/${params.id}:`, error);
    return NextResponse.json({ error: 'Erro ao excluir professor.' }, { status: 500 });
  }
}

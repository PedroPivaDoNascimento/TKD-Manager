import { NextRequest, NextResponse } from 'next/server';
import { ProfessorService } from '@/modules/professores/professor.service';
import { professorCreateSchema } from '@/modules/professores/professor.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const professorService = new ProfessorService();

export async function GET() {
  try {
    const professores = await professorService.listProfessors();
    return NextResponse.json({ data: professores });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota GET /api/professores:', error);
    return NextResponse.json({ error: 'Erro ao listar professores.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = professorCreateSchema.parse(body);
    const professor = await professorService.createProfessor(dto);

    return NextResponse.json(
      { data: professor, message: 'Professor cadastrado com sucesso.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota POST /api/professores:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar professor.' }, { status: 500 });
  }
}

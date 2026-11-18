import { NextRequest, NextResponse } from 'next/server';
import { AlunoService } from '@/modules/alunos/aluno.service';
import { alunoCreateSchema, alunoQuerySchema } from '@/modules/alunos/aluno.dto';
import { DomainError } from '@/lib/errors';
import { ZodError } from 'zod';

const alunoService = new AlunoService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get('busca') || undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const faixa = (searchParams.get('faixa') as any) || undefined;
    const suggest = searchParams.get('suggestMatricula');

    if (suggest === 'true') {
      const matricula = await alunoService.suggestNextMatricula();
      return NextResponse.json({ data: { matricula } });
    }

    const query = alunoQuerySchema.parse({ busca, status, faixa });
    const alunos = await alunoService.listAlunos(query);

    return NextResponse.json({ data: alunos });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota GET /api/alunos:', error);
    return NextResponse.json({ error: 'Erro interno ao listar alunos.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = alunoCreateSchema.parse(body);
    const aluno = await alunoService.createAluno(dto);

    return NextResponse.json({ data: aluno, message: 'Aluno cadastrado com sucesso.' }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota POST /api/alunos:', error);
    return NextResponse.json({ error: 'Erro interno ao cadastrar aluno.' }, { status: 500 });
  }
}

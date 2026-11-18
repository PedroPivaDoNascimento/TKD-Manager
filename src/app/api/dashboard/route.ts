import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/modules/dashboard/dashboard.service';
import { DomainError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

const dashboardService = new DashboardService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const competencia = searchParams.get('competencia') || undefined;

    const data = await dashboardService.getOverview(competencia);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erro na rota GET /api/dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar dados do dashboard.' },
      { status: 500 }
    );
  }
}

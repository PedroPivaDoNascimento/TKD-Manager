'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  AlertTriangle,
  CircleDollarSign,
  Award,
  RefreshCw,
} from 'lucide-react';
import { formatCentsToBRL } from '@/lib/money';

const COLORS_FAIXAS: Record<string, { label: string; color: string }> = {
  BRANCA: { label: 'Branca', color: '#E2E8F0' },
  CINZA: { label: 'Cinza', color: '#94A3B8' },
  AMARELA: { label: 'Amarela', color: '#FACC15' },
  LARANJA: { label: 'Laranja', color: '#FB923C' },
  VERDE: { label: 'Verde', color: '#22C55E' },
  ROXA: { label: 'Roxa', color: '#A855F7' },
  AZUL: { label: 'Azul', color: '#3B82F6' },
  MARROM: { label: 'Marrom', color: '#92400E' },
  VERMELHA: { label: 'Vermelha', color: '#EF4444' },
  VERMELHA_PONTA_PRETA: { label: 'Verm. Ponta Preta', color: '#991B1B' },
  PRETA: { label: 'Preta', color: '#18181B' },
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao carregar métricas.');
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <RefreshCw className="w-8 h-8 animate-spin text-miguetti-red mb-3" />
        <p className="text-sm font-medium">Carregando indicadores da academia...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <p className="font-semibold">Não foi possível carregar o dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-miguetti-red text-white text-xs font-semibold rounded-lg hover:bg-miguetti-red-hover"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { kpis, alunosPorFaixa } = data;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-miguetti-silver/30">
        <div>
          <h1 className="text-2xl font-bold font-display text-miguetti-dark">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Painel Geral de Alunos, Mensalidades e Desempenho da Academia
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-miguetti-silver bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar Dados
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Alunos */}
        <div className="bg-white p-5 rounded-xl border border-miguetti-silver/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Total de Alunos
              </p>
              <h3 className="text-2xl font-bold text-miguetti-dark mt-1">
                {kpis.totalAlunos}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span>{kpis.alunosAtivos} ativos</span>
            <span className="text-gray-300">•</span>
            <span>{kpis.alunosInativos} inativos</span>
          </div>
        </div>

        {/* Total Recebido */}
        <div className="bg-white p-5 rounded-xl border border-miguetti-silver/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Total Recebido
              </p>
              <h3 className="text-2xl font-bold text-miguetti-success mt-1">
                {formatCentsToBRL(kpis.totalArrecadadoCents)}
              </h3>
            </div> 
            <div className="p-3 bg-green-50 text-miguetti-success rounded-xl">
              <CircleDollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">Valores em centavos conferidos</p>
        </div>

        {/* Inadimplência */}
        <div className="bg-white p-5 rounded-xl border border-miguetti-silver/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Inadimplência
              </p>
              <h3 className="text-2xl font-bold text-miguetti-red mt-1">
                {formatCentsToBRL(kpis.totalVencidoCents)}
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-miguetti-red rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-red-600 font-medium">
            {kpis.inadimplenciaCount} mensalidade(s) em atraso
          </p>
        </div>
      </div>

      {/* Distribuição por Faixa de Graduação */}
      <div className="bg-white rounded-2xl border border-miguetti-silver/30 shadow-sm p-6">
        <div className="mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-miguetti-red" />
          <h2 className="text-lg font-bold font-display text-miguetti-dark">
            Distribuição por Graduação
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {alunosPorFaixa.map((item: any, idx: number) => {
            const info = COLORS_FAIXAS[item.faixa] || { label: item.faixa, color: '#CCCCCC' };
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                <div
                  className="w-full h-1.5 absolute top-0 left-0"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-[11px] font-bold text-gray-500 uppercase mt-1">
                  Faixa {info.label}
                </span>
                <span className="text-2xl font-black text-gray-900 mt-1">
                  {item.total}
                </span>
                <span className="text-[10px] text-gray-400">aluno(s)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

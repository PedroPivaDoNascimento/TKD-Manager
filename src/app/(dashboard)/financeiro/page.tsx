'use client';

import { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  Send,
  Plus,
  RefreshCw,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
  X,
  Edit2,
  Trash2,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatCentsToBRL, parseBRLToCents } from '@/lib/money';

export default function FinanceiroPage() {
  const [mensalidades, setMensalidades] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCompetencia, setFiltroCompetencia] = useState('');

  // Modais
  const [modalNovaMensalidade, setModalNovaMensalidade] = useState(false);
  const [modalEditarMensalidade, setModalEditarMensalidade] = useState(false);
  const [modalMassa, setModalMassa] = useState(false);
  const [modalWhatsAppLote, setModalWhatsAppLote] = useState(false);

  // Form states - Mensalidade Individual
  const [alunoId, setAlunoId] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [valorBRL, setValorBRL] = useState('150,00');
  const [vencimento, setVencimento] = useState('');
  const [editingMensalidade, setEditingMensalidade] = useState<any | null>(null);
  const [editValorBRL, setEditValorBRL] = useState('');
  const [editVencimento, setEditVencimento] = useState('');
  const [editCompetencia, setEditCompetencia] = useState('');
  const [editStatus, setEditStatus] = useState<'PENDENTE' | 'PAGO' | 'VENCIDO'>('PENDENTE');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states - Lançamento em Massa
  const [massaModo, setMassaModo] = useState<'TODOS' | 'SELECIONADOS'>('TODOS');
  const [selectedAlunos, setSelectedAlunos] = useState<string[]>([]);
  const [massaCompetencia, setMassaCompetencia] = useState('');
  const [massaDiaVencimento, setMassaDiaVencimento] = useState(10);
  const [massaTipo, setMassaTipo] = useState<'UNICA' | 'RECORRENTE'>('UNICA');
  const [massaMeses, setMassaMeses] = useState(1);

  // Disparo Assistido WhatsApp
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [linksGerados, setLinksGerados] = useState<any[]>([]);
  const [gerandoLinks, setGerandoLinks] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  const hoje = new Date();
  const mesAtualStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroStatus) params.set('status', filtroStatus);
      if (filtroCompetencia) params.set('competencia', filtroCompetencia);

      const [resMensalidades, resSummary, resAlunos, resTemplates] = await Promise.all([
        fetch(`/api/mensalidades?${params.toString()}`),
        fetch(`/api/mensalidades?summary=true${filtroCompetencia ? `&competencia=${filtroCompetencia}` : ''}`),
        fetch('/api/alunos?status=ATIVO'),
        fetch('/api/templates'),
      ]);

      const jsonM = await resMensalidades.json();
      const jsonS = await resSummary.json();
      const jsonA = await resAlunos.json();
      const jsonT = await resTemplates.json();

      setMensalidades(jsonM.data || []);
      setSummary(jsonS.data || null);
      setAlunos(jsonA.data || []);
      const tList = jsonT.data || [];
      setTemplates(tList);
      if (tList.length > 0 && !selectedTemplateId) {
        const def = tList.find((t: any) => t.isDefault) || tList[0];
        setSelectedTemplateId(def.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filtroStatus, filtroCompetencia]);

  // Timer do Cooldown Visual
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Ao selecionar um aluno para lançamento individual, atualiza o valor da mensalidade padrão dele
  const handleSelectAlunoChange = (id: string) => {
    setAlunoId(id);
    const chosen = alunos.find((a) => a.id === id);
    if (chosen) {
      setValorBRL((chosen.valorMensalidadeCents / 100).toFixed(2).replace('.', ','));
    }
  };

  // Alterar status de mensalidade individualmente via select
  const handleUpdateStatus = async (id: string, novoStatus: 'PAGO' | 'PENDENTE' | 'VENCIDO') => {
    try {
      await fetch(`/api/mensalidades/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Excluir mensalidade
  const handleDeleteMensalidade = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta mensalidade?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/mensalidades/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir mensalidade.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Falha ao excluir mensalidade.');
    } finally {
      setDeletingId(null);
    }
  };

  // Abrir Modal de Edição de Mensalidade
  const openEditMensalidade = (m: any) => {
    setEditingMensalidade(m);
    setEditValorBRL((m.valorCents / 100).toFixed(2).replace('.', ','));
    setEditVencimento(m.vencimento ? m.vencimento.slice(0, 10) : '');
    setEditCompetencia(m.competencia);
    setEditStatus(m.status);
    setFormError(null);
    setModalEditarMensalidade(true);
  };

  // Salvar Edição de Mensalidade
  const handleSalvarEdicaoMensalidade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !editingMensalidade) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/mensalidades/${editingMensalidade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valorCents: parseBRLToCents(editValorBRL),
          vencimento: editVencimento,
          competencia: editCompetencia,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar alterações.');

      setModalEditarMensalidade(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Falha ao editar mensalidade.');
    } finally {
      setSubmitting(false);
    }
  };

  // Criar Mensalidade Individual
  const handleNovaMensalidade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/mensalidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alunoId,
          competencia,
          valorCents: parseBRLToCents(valorBRL),
          vencimento,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao lançar mensalidade.');

      setModalNovaMensalidade(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Falha ao salvar mensalidade.');
    } finally {
      setSubmitting(false);
    }
  };

  // Geração de Mensalidades em Massa
  const handleGerarMassa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (massaModo === 'SELECIONADOS' && selectedAlunos.length === 0) {
      alert('Selecione ao menos um aluno na lista.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        alunoIds: massaModo === 'TODOS' ? 'ALL' : selectedAlunos,
        competenciaInicial: massaCompetencia || mesAtualStr,
        diaVencimento: Number(massaDiaVencimento),
        tipo: massaTipo,
        quantidadeMeses: massaTipo === 'RECORRENTE' ? Number(massaMeses) : 1,
      };

      const res = await fetch('/api/mensalidades?action=gerar-massa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar mensalidades em massa.');

      alert(data.message);
      setModalMassa(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Falha na geração em massa.');
    } finally {
      setSubmitting(false);
    }
  };

  // Disparo Individual de WhatsApp
  const handleDisparoIndividual = async (mensalidadeId: string) => {
    try {
      const res = await fetch('/api/mensalidades?action=cobranca-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensalidadeId,
          templateId: selectedTemplateId || undefined,
        }),
      });
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        window.open(json.data[0].whatsappUrl, '_blank');
      } else {
        alert('Nenhum telefone de contato cadastrado para este registro.');
      }
    } catch (err: any) {
      alert('Falha ao gerar link do WhatsApp.');
    }
  };

  // Disparo em Lote com Assistente Seguro
  const handleGerarLoteWhatsApp = async () => {
    setGerandoLinks(true);
    setLinksGerados([]);
    setSentMap({});
    try {
      const res = await fetch('/api/mensalidades?action=cobranca-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencia: filtroCompetencia || mesAtualStr,
          apenasInadimplentes: true,
          templateId: selectedTemplateId || undefined,
        }),
      });

      const json = await res.json();
      setLinksGerados(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setGerandoLinks(false);
    }
  };

  // Ação de envio do link com acionamento do Cooldown Anti-Ban
  const handleSendLink = (item: any) => {
    window.open(item.whatsappUrl, '_blank');
    setSentMap((prev) => ({ ...prev, [item.mensalidadeId]: true }));
    // Cooldown preventivo de 4 segundos para evitar disparo robótico no WhatsApp Web
    setCooldownSeconds(4);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-miguetti-silver/30">
        <div>
          <h1 className="text-2xl font-bold font-display text-miguetti-dark">
            Controle Financeiro
          </h1>
          <p className="text-sm text-gray-600">
            Mensalidades, gestão em massa por aluno e régua de cobrança assistida via WhatsApp
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setModalMassa(true);
              setMassaCompetencia(mesAtualStr);
              setMassaDiaVencimento(10);
              setMassaTipo('UNICA');
              setMassaMeses(1);
              setSelectedAlunos(alunos.map((a) => a.id));
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
          >
            <Layers className="w-4 h-4" />
            Lançamento em Massa
          </button>
          <button
            onClick={() => {
              setModalWhatsAppLote(true);
              handleGerarLoteWhatsApp();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-miguetti-whatsapp text-white text-xs font-semibold hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
          >
            <Send className="w-4 h-4" />
            Disparo Assistido (WhatsApp)
          </button>
          <button
            onClick={() => {
              const defaultAluno = alunos[0];
              setModalNovaMensalidade(true);
              setAlunoId(defaultAluno?.id || '');
              if (defaultAluno) {
                setValorBRL((defaultAluno.valorMensalidadeCents / 100).toFixed(2).replace('.', ','));
              } else {
                setValorBRL('150,00');
              }
              setCompetencia(mesAtualStr);
              setVencimento(new Date().toISOString().slice(0, 10));
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-miguetti-red text-white text-xs font-semibold hover:bg-miguetti-red-hover transition-all shadow-md shadow-miguetti-red/20"
          >
            <Plus className="w-4 h-4" />
            Lançar Mensalidade
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-miguetti-silver/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-gray-500">Total Arrecadado</p>
                <h4 className="text-xl font-bold text-miguetti-success mt-1">
                  {formatCentsToBRL(summary.totalArrecadadoCents)}
                </h4>
              </div>
              <div className="p-2.5 bg-green-50 text-miguetti-success rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">{summary.countPagos} mensalidade(s) pagas</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-miguetti-silver/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-gray-500">Pendente no Mês</p>
                <h4 className="text-xl font-bold text-miguetti-warning mt-1">
                  {formatCentsToBRL(summary.totalPendenteCents)}
                </h4>
              </div>
              <div className="p-2.5 bg-amber-50 text-miguetti-warning rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">{summary.countPendentes} mensalidade(s) pendentes</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-miguetti-silver/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-gray-500">Inadimplência</p>
                <h4 className="text-xl font-bold text-miguetti-red mt-1">
                  {formatCentsToBRL(summary.totalVencidoCents)}
                </h4>
              </div>
              <div className="p-2.5 bg-red-50 text-miguetti-red rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-red-600 font-semibold mt-2">
              {summary.countVencidos} mensalidade(s) vencidas
            </p>
          </div>
        </div>
      )}

      {/* Filtros Limpos (sem barra de pesquisa secundária nem botão obsoleto de folha) */}
      <div className="bg-white p-4 rounded-xl border border-miguetti-silver/30 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-miguetti-red focus:outline-none"
          >
            <option value="">Todos os Status</option>
            <option value="PAGO">Pago</option>
            <option value="PENDENTE">Pendente</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>

        <button
          onClick={loadData}
          className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          title="Recarregar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabela de Mensalidades com Edição e Exclusão */}
      <div className="bg-white rounded-2xl border border-miguetti-silver/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Aluno / Matrícula</th>
                <th className="py-3 px-4">Competência</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-miguetti-red mb-2" />
                    Carregando lançamentos...
                  </td>
                </tr>
              ) : mensalidades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Nenhuma mensalidade encontrada.
                  </td>
                </tr>
              ) : (
                mensalidades.map((m) => {
                  const vencimentoFormatado = new Date(m.vencimento).toLocaleDateString('pt-BR');
                  const isVencido = m.status === 'VENCIDO';
                  const isPago = m.status === 'PAGO';

                  return (
                    <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{m.aluno?.nome}</div>
                        <div className="text-[11px] font-mono text-gray-500">
                          {m.aluno?.matricula}
                          {m.aluno?.responsavel && (
                            <span className="ml-2 text-blue-600 font-sans">
                              (Resp: {m.aluno.responsavel.nome})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-700">
                        {m.competencia}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {vencimentoFormatado}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {formatCentsToBRL(m.valorCents)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPago
                              ? 'bg-green-100 text-green-800'
                              : isVencido
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!isPago ? (
                          <button
                            onClick={() => handleDisparoIndividual(m.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-miguetti-whatsapp/10 text-miguetti-whatsapp hover:bg-miguetti-whatsapp hover:text-white transition-all font-semibold text-[11px]"
                            title="Disparar lembrete no WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            Disparar wa.me
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Quitado</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={m.status}
                            onChange={(e) => handleUpdateStatus(m.id, e.target.value as any)}
                            className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none"
                          >
                            <option value="PENDENTE">Pendente</option>
                            <option value="PAGO">Pago</option>
                            <option value="VENCIDO">Vencido</option>
                          </select>
                          <button
                            onClick={() => openEditMensalidade(m)}
                            className="p-1 text-gray-500 hover:text-miguetti-red hover:bg-gray-100 rounded"
                            title="Editar Valor / Vencimento"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMensalidade(m.id)}
                            disabled={deletingId === m.id}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                            title="Excluir Mensalidade"
                          >
                            {deletingId === m.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Mensalidade Individual */}
      {modalNovaMensalidade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold font-display text-miguetti-dark">
                Lançar Mensalidade Individual
              </h3>
              <button
                onClick={() => setModalNovaMensalidade(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleNovaMensalidade} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Aluno *</label>
                <select
                  value={alunoId}
                  onChange={(e) => handleSelectAlunoChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  required
                >
                  {alunos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome} ({a.matricula}) — Padrão: {formatCentsToBRL(a.valorMensalidadeCents)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Competência (AAAA-MM) *</label>
                <input
                  type="month"
                  required
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Data de Vencimento *</label>
                <input
                  type="date"
                  required
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  type="text"
                  required
                  value={valorBRL}
                  onChange={(e) => setValorBRL(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalNovaMensalidade(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-miguetti-red text-white font-semibold hover:bg-miguetti-red-hover flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Mensalidade (Valor e Vencimento) */}
      {modalEditarMensalidade && editingMensalidade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold font-display text-miguetti-dark">
                Editar Mensalidade
              </h3>
              <button
                onClick={() => setModalEditarMensalidade(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSalvarEdicaoMensalidade} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-0.5">Aluno</label>
                <p className="font-semibold text-gray-900 text-sm">
                  {editingMensalidade.aluno?.nome} ({editingMensalidade.aluno?.matricula})
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Competência *</label>
                <input
                  type="month"
                  required
                  value={editCompetencia}
                  onChange={(e) => setEditCompetencia(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Data de Vencimento *</label>
                <input
                  type="date"
                  required
                  value={editVencimento}
                  onChange={(e) => setEditVencimento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  type="text"
                  required
                  value={editValorBRL}
                  onChange={(e) => setEditValorBRL(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="PAGO">Pago</option>
                  <option value="VENCIDO">Vencido</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalEditarMensalidade(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-miguetti-red text-white font-semibold hover:bg-miguetti-red-hover flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lançamento em Massa (Geral ou Selecionados) */}
      {modalMassa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-miguetti-red" />
                <h3 className="text-base font-bold font-display text-miguetti-dark">
                  Criação de Mensalidades em Massa
                </h3>
              </div>
              <button
                onClick={() => setModalMassa(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-2">
              As mensalidades serão criadas utilizando automaticamente o{' '}
              <strong className="text-miguetti-red">
                valor de mensalidade cadastrado no perfil de cada aluno
              </strong>
              .
            </p>

            <form onSubmit={handleGerarMassa} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Público-Alvo do Lançamento
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="massaModo"
                      checked={massaModo === 'TODOS'}
                      onChange={() => setMassaModo('TODOS')}
                    />
                    <span>Todos os Alunos Ativos ({alunos.length})</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="massaModo"
                      checked={massaModo === 'SELECIONADOS'}
                      onChange={() => setMassaModo('SELECIONADOS')}
                    />
                    <span>Alunos Específicos</span>
                  </label>
                </div>
              </div>

              {massaModo === 'SELECIONADOS' && (
                <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                  <div className="flex justify-between items-center pb-1 border-b border-gray-200 mb-2">
                    <span className="font-bold text-[11px] text-gray-700">Selecione os Alunos:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAlunos(
                          selectedAlunos.length === alunos.length ? [] : alunos.map((a) => a.id)
                        )
                      }
                      className="text-[10px] text-miguetti-red font-semibold hover:underline"
                    >
                      {selectedAlunos.length === alunos.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                    </button>
                  </div>
                  {alunos.map((a) => (
                    <label
                      key={a.id}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAlunos.includes(a.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAlunos([...selectedAlunos, a.id]);
                            } else {
                              setSelectedAlunos(selectedAlunos.filter((id) => id !== a.id));
                            }
                          }}
                          className="rounded text-miguetti-red"
                        />
                        <span className="font-semibold text-gray-900">{a.nome}</span>
                      </div>
                      <span className="font-mono text-gray-500 font-bold">
                        {formatCentsToBRL(a.valorMensalidadeCents)}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Competência Inicial *
                  </label>
                  <input
                    type="month"
                    required
                    value={massaCompetencia}
                    onChange={(e) => setMassaCompetencia(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Dia de Vencimento *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    required
                    value={massaDiaVencimento}
                    onChange={(e) => setMassaDiaVencimento(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Modalidade de Cobrança
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="massaTipo"
                      checked={massaTipo === 'UNICA'}
                      onChange={() => setMassaTipo('UNICA')}
                    />
                    <span>Cobrança Única (Apenas 1 Mês)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="massaTipo"
                      checked={massaTipo === 'RECORRENTE'}
                      onChange={() => setMassaTipo('RECORRENTE')}
                    />
                    <span>Recorrente (Múltiplos Meses)</span>
                  </label>
                </div>
              </div>

              {massaTipo === 'RECORRENTE' && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Quantidade de Meses a Gerar (Ex: 3, 6 ou 12 meses)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={24}
                    value={massaMeses}
                    onChange={(e) => setMassaMeses(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Serão geradas {massaMeses} mensalidades consecutivas para cada aluno.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalMassa(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-miguetti-red text-white font-semibold hover:bg-miguetti-red-hover flex items-center gap-1.5 shadow-md shadow-miguetti-red/20 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Gerar Mensalidades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal WhatsApp com Fluxo Assistido e Cooldown Anti-Ban */}
      {modalWhatsAppLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-miguetti-whatsapp" />
                <div>
                  <h3 className="text-base font-bold font-display text-miguetti-dark">
                    Disparo Assistido via WhatsApp (Anti-Ban)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Fila controlada com temporizador inteligente para proteger seu WhatsApp de bloqueios
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalWhatsAppLote(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seleção do Template */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
              <label className="block font-bold text-gray-700">
                Escolha o Template de Mensagem:
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-left ${
                      selectedTemplateId === tpl.id
                        ? 'bg-miguetti-red text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {tpl.titulo} {tpl.isDefault && '(Padrão)'}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleGerarLoteWhatsApp}
                  disabled={gerandoLinks}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black flex items-center gap-1.5"
                >
                  {gerandoLinks ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Recalcular Fila de Envio
                </button>
              </div>
            </div>

            {/* Barra de Cooldown Visual */}
            {cooldownSeconds > 0 && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  Cooldown ativo: aguarde {cooldownSeconds}s antes de disparar o próximo para segurança
                  da conta.
                </span>
                <span className="text-sm font-mono font-bold bg-amber-200/60 px-2 py-0.5 rounded">
                  00:0{cooldownSeconds}
                </span>
              </div>
            )}

            {/* Fila de Mensagens */}
            <div className="flex-1 overflow-y-auto mt-4 border border-gray-100 rounded-xl p-3 divide-y divide-gray-100 space-y-3">
              {linksGerados.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-xs">
                  {gerandoLinks
                    ? 'Preparando fila de mensagens...'
                    : 'Nenhum inadimplente encontrado com telefone válido.'}
                </p>
              ) : (
                linksGerados.map((item, idx) => {
                  const alreadySent = sentMap[item.mensalidadeId];

                  return (
                    <div
                      key={idx}
                      className={`pt-3 first:pt-0 flex items-start justify-between gap-4 p-2 rounded-lg transition-colors ${
                        alreadySent ? 'bg-green-50/50' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <span>{item.alunoNome}</span>
                          {item.isResponsavel && (
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              Resp: {item.destinatarioNome}
                            </span>
                          )}
                          {alreadySent && (
                            <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Enviado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg whitespace-pre-wrap font-sans border border-gray-100">
                          {item.mensagem}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">Destino: {item.telefone}</p>
                      </div>

                      <button
                        onClick={() => handleSendLink(item)}
                        disabled={cooldownSeconds > 0}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs shrink-0 transition-all shadow-sm ${
                          alreadySent
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-miguetti-whatsapp text-white hover:bg-green-600'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        <span>{alreadySent ? 'Reenviar' : 'Enviar Agora'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Total na fila: {linksGerados.length} contato(s)
              </span>
              <button
                onClick={() => setModalWhatsAppLote(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

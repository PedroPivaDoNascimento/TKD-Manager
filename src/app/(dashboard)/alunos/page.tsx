'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  X,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { formatCentsToBRL, parseBRLToCents } from '@/lib/money';

const FAIXA_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  BRANCA: { label: 'Branca', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  CINZA: { label: 'Cinza', bg: 'bg-slate-200', text: 'text-slate-800', border: 'border-slate-400' },
  AMARELA: { label: 'Amarela', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
  LARANJA: { label: 'Laranja', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
  VERDE: { label: 'Verde', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  ROXA: { label: 'Roxa', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
  AZUL: { label: 'Azul', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
  MARROM: { label: 'Marrom', bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-700' },
  VERMELHA: { label: 'Vermelha', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' },
  VERMELHA_PONTA_PRETA: { label: 'Vermelha Ponta Preta', bg: 'bg-red-200', text: 'text-zinc-950 font-black', border: 'border-zinc-900' },
  PRETA: { label: 'Preta', bg: 'bg-zinc-900', text: 'text-white', border: 'border-black' },
};

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroFaixa, setFiltroFaixa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  // Modal de Cadastro/Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Visualização Detalhada
  const [viewingAluno, setViewingAluno] = useState<any | null>(null);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [faixaAtual, setFaixaAtual] = useState('BRANCA');
  const [dataUltimoExame, setDataUltimoExame] = useState('');
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');
  const [valorMensalidade, setValorMensalidade] = useState('150,00');

  // Responsável (se menor de idade)
  const [temResponsavel, setTemResponsavel] = useState(false);
  const [respNome, setRespNome] = useState('');
  const [respCpf, setRespCpf] = useState('');
  const [respTelefone, setRespTelefone] = useState('');
  const [respParentesco, setRespParentesco] = useState('Pai');

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busca) params.set('busca', busca);
      if (filtroFaixa) params.set('faixa', filtroFaixa);
      if (filtroStatus) params.set('status', filtroStatus);

      const resAlunos = await fetch(`/api/alunos?${params.toString()}`);
      const jsonAlunos = await resAlunos.json();

      setAlunos(jsonAlunos.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [busca, filtroFaixa, filtroStatus]);

  // Checar se a data informada caracteriza menor de idade (< 18)
  const checkIsMinor = (dateStr: string) => {
    if (!dateStr) return false;
    const birth = new Date(dateStr);
    if (isNaN(birth.getTime())) return false;
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    return birth > cutoff;
  };

  const handleNascimentoChange = (val: string) => {
    setDataNascimento(val);
    if (checkIsMinor(val)) {
      setTemResponsavel(true);
    }
  };

  const openNewModal = async () => {
    setEditingAluno(null);
    setFormError(null);
    setNome('');
    setDataNascimento('');
    setSexo('M');
    setTelefone('');
    setEmail('');
    setEndereco('');
    setFaixaAtual('BRANCA');
    setDataUltimoExame('');
    setStatus('ATIVO');
    setValorMensalidade('150,00');
    setTemResponsavel(false);
    setRespNome('');
    setRespCpf('');
    setRespTelefone('');
    setRespParentesco('Pai');

    // Buscar sugestão de matrícula
    try {
      const res = await fetch('/api/alunos?suggestMatricula=true');
      const json = await res.json();
      setMatricula(json.data?.matricula || `MT-${new Date().getFullYear()}-0001`);
    } catch {
      setMatricula(`MT-${new Date().getFullYear()}-0001`);
    }

    setModalOpen(true);
  };

  const openEditModal = (aluno: any) => {
    setEditingAluno(aluno);
    setFormError(null);
    setMatricula(aluno.matricula);
    setNome(aluno.nome);
    setDataNascimento(aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : '');
    setSexo(aluno.sexo || 'M');
    setTelefone(aluno.telefone || '');
    setEmail(aluno.email || '');
    setEndereco(aluno.endereco || '');
    setFaixaAtual(aluno.faixaAtual || 'BRANCA');
    setDataUltimoExame(aluno.dataUltimoExame ? aluno.dataUltimoExame.slice(0, 10) : '');
    setStatus(aluno.status);
    setValorMensalidade((aluno.valorMensalidadeCents / 100).toFixed(2).replace('.', ','));

    if (aluno.responsavel) {
      setTemResponsavel(true);
      setRespNome(aluno.responsavel.nome || '');
      setRespCpf(aluno.responsavel.cpf || '');
      setRespTelefone(aluno.responsavel.telefone || '');
      setRespParentesco(aluno.responsavel.parentesco || 'Responsável Legal');
    } else {
      setTemResponsavel(checkIsMinor(aluno.dataNascimento));
      setRespNome('');
      setRespCpf('');
      setRespTelefone('');
      setRespParentesco('Responsável Legal');
    }

    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevenção de duplo clique

    setFormError(null);
    setSubmitting(true);

    try {
      const isMenor = checkIsMinor(dataNascimento);
      if (isMenor && (!respNome || !respTelefone)) {
        throw new Error('Alunos menores de 18 anos exigem nome e telefone do responsável.');
      }

      const payload: any = {
        matricula,
        nome,
        dataNascimento,
        sexo,
        telefone: telefone || undefined,
        email: email || undefined,
        endereco: endereco || undefined,
        faixaAtual,
        dataUltimoExame: dataUltimoExame || undefined,
        status,
        valorMensalidadeCents: parseBRLToCents(valorMensalidade),
      };

      if (temResponsavel && respNome) {
        payload.responsavel = {
          nome: respNome,
          cpf: respCpf || undefined,
          telefone: respTelefone,
          parentesco: respParentesco,
        };
      }

      const url = editingAluno ? `/api/alunos/${editingAluno.id}` : '/api/alunos';
      const method = editingAluno ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar aluno.');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Falha ao processar formulário.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAluno = async (id: string, alunoNome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o aluno "${alunoNome}"? Todas as suas mensalidades também serão excluídas.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/alunos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir aluno.');
      loadData();
      if (modalViewOpen && viewingAluno?.id === id) {
        setModalViewOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Falha ao excluir aluno.');
    } finally {
      setDeletingId(null);
    }
  };

  const openViewModal = (aluno: any) => {
    setViewingAluno(aluno);
    setModalViewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-miguetti-silver/30">
        <div>
          <h1 className="text-2xl font-bold font-display text-miguetti-dark">
            Gestão de Alunos
          </h1>
          <p className="text-sm text-gray-600">
            Ficha cadastral, graduação e mensalidades
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-miguetti-red text-white text-xs font-semibold hover:bg-miguetti-red-hover active:scale-[0.98] shadow-md shadow-miguetti-red/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Aluno
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-miguetti-silver/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por matrícula ou nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-miguetti-red"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filtroFaixa}
            onChange={(e) => setFiltroFaixa(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-miguetti-red bg-white"
          >
            <option value="">Todas as Faixas</option>
            {Object.entries(FAIXA_BADGES).map(([chave, val]) => (
              <option key={chave} value={chave}>
                Faixa {val.label}
              </option>
            ))}
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-miguetti-red bg-white"
          >
            <option value="">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>

          <button
            onClick={loadData}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            title="Recarregar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-2xl border border-miguetti-silver/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Aluno</th>
                <th className="py-3 px-4">Faixa Atual</th>
                <th className="py-3 px-4">Mensalidade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-miguetti-red mb-2" />
                    Carregando fichas de alunos...
                  </td>
                </tr>
              ) : alunos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                alunos.map((aluno) => {
                  const badge = FAIXA_BADGES[aluno.faixaAtual] || FAIXA_BADGES.BRANCA;

                  return (
                    <tr key={aluno.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {aluno.matricula}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{aluno.nome}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          {aluno.telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {aluno.telefone}
                            </span>
                          )}
                          {aluno.responsavel && (
                            <span className="text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                              Resp: {aluno.responsavel.nome}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          Faixa {badge.label || aluno.faixaAtual}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {formatCentsToBRL(aluno.valorMensalidadeCents)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            aluno.status === 'ATIVO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {aluno.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openViewModal(aluno)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar Ficha"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(aluno)}
                            className="p-1.5 text-gray-500 hover:text-miguetti-red hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar Aluno"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAluno(aluno.id, aluno.nome)}
                            disabled={deletingId === aluno.id}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Excluir Aluno"
                          >
                            {deletingId === aluno.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
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

      {/* Modal de Cadastro / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold font-display text-miguetti-dark">
                {editingAluno ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 text-xs">
              {/* Identificação Básica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Número de Matrícula *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingAluno}
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono font-bold focus:ring-2 focus:ring-miguetti-red focus:outline-none disabled:bg-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nome Completo do Aluno *
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do atleta"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Data Nascimento e Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={dataNascimento}
                    onChange={(e) => handleNascimentoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  />
                  {checkIsMinor(dataNascimento) && (
                    <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                      Menor de 18 anos (exige responsável)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sexo</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Telefone WhatsApp
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="5511999998888"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Faixa e Mensalidade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Faixa de Taekwondo *
                  </label>
                  <select
                    value={faixaAtual}
                    onChange={(e) => setFaixaAtual(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-miguetti-red focus:outline-none font-semibold"
                  >
                    {Object.entries(FAIXA_BADGES).map(([chave, val]) => (
                      <option key={chave} value={chave}>
                        Faixa {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Valor Mensalidade (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    value={valorMensalidade}
                    onChange={(e) => setValorMensalidade(e.target.value)}
                    placeholder="150,00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Dados do Responsável */}
              {(temResponsavel || checkIsMinor(dataNascimento)) && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">
                      Dados do Responsável Legal (Cobranças serão enviadas para cá)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 mb-0.5">Nome do Responsável *</label>
                      <input
                        type="text"
                        required
                        value={respNome}
                        onChange={(e) => setRespNome(e.target.value)}
                        placeholder="Nome do pai/mãe/tutor"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-0.5">Telefone WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={respTelefone}
                        onChange={(e) => setRespTelefone(e.target.value)}
                        placeholder="5511999998888"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-0.5">Parentesco</label>
                      <input
                        type="text"
                        value={respParentesco}
                        onChange={(e) => setRespParentesco(e.target.value)}
                        placeholder="Pai, Mãe, Tutor"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-0.5">CPF (Opcional)</label>
                      <input
                        type="text"
                        value={respCpf}
                        onChange={(e) => setRespCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-miguetti-red text-white font-semibold hover:bg-miguetti-red-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-miguetti-red/20 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingAluno ? 'Salvar Alterações' : 'Concluir Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização Detalhada */}
      {modalViewOpen && viewingAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-miguetti-red/10 text-miguetti-red flex items-center justify-center font-bold">
                  <Image src="/images/logo-miguetti.png" alt="Logo" width={20} height={20} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-miguetti-dark">
                    {viewingAluno.nome}
                  </h3>
                  <p className="text-xs font-mono text-gray-500">
                    Matrícula: {viewingAluno.matricula}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalViewOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-500 block mb-0.5">Faixa Atual</span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      FAIXA_BADGES[viewingAluno.faixaAtual]?.bg || 'bg-gray-100'
                    } ${FAIXA_BADGES[viewingAluno.faixaAtual]?.text || 'text-gray-800'} ${
                      FAIXA_BADGES[viewingAluno.faixaAtual]?.border || 'border-gray-300'
                    }`}
                  >
                    Faixa {FAIXA_BADGES[viewingAluno.faixaAtual]?.label || viewingAluno.faixaAtual}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      viewingAluno.status === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {viewingAluno.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Mensalidade Padrão</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCentsToBRL(viewingAluno.valorMensalidadeCents)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Data de Nascimento</span>
                  <span className="font-semibold text-gray-800">
                    {viewingAluno.dataNascimento
                      ? new Date(viewingAluno.dataNascimento).toLocaleDateString('pt-BR')
                      : 'Não informada'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-800 uppercase text-[11px] tracking-wider">
                  Contato & Localização
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{viewingAluno.telefone || 'Sem telefone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{viewingAluno.email || 'Sem e-mail'}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{viewingAluno.endereco || 'Sem endereço'}</span>
                  </div>
                </div>
              </div>

              {viewingAluno.responsavel && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
                  <h4 className="font-bold text-blue-950 uppercase text-[11px] tracking-wider">
                    Responsável Legal (Cobranças)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-blue-900">
                    <div>
                      <span className="text-blue-600 block text-[10px]">Nome</span>
                      <span className="font-semibold">{viewingAluno.responsavel.nome}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 block text-[10px]">WhatsApp</span>
                      <span className="font-semibold">{viewingAluno.responsavel.telefone}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 block text-[10px]">Parentesco</span>
                      <span>{viewingAluno.responsavel.parentesco}</span>
                    </div>
                    {viewingAluno.responsavel.cpf && (
                      <div>
                        <span className="text-blue-600 block text-[10px]">CPF</span>
                        <span>{viewingAluno.responsavel.cpf}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => handleDeleteAluno(viewingAluno.id, viewingAluno.nome)}
                disabled={deletingId === viewingAluno.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {deletingId === viewingAluno.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Excluir Aluno
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setModalViewOpen(false);
                    openEditModal(viewingAluno);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setModalViewOpen(false)}
                  className="px-4 py-1.5 bg-miguetti-dark text-white hover:bg-black rounded-lg text-xs font-semibold transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

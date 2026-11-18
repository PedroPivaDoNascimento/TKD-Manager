'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Template
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [titulo, setTitulo] = useState('');
  const [corpo, setCorpo] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates');
      const json = await res.json();
      setTemplates(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const openNewModal = () => {
    setEditingTemplate(null);
    setTitulo('');
    setCorpo('');
    setIsDefault(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTemplate(t);
    setTitulo(t.titulo);
    setCorpo(t.corpo);
    setIsDefault(t.isDefault);
    setFormError(null);
    setModalOpen(true);
  };

  const handleInsertTag = (tag: string) => {
    setCorpo((prev) => prev + tag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const url = editingTemplate ? `/api/templates/${editingTemplate.id}` : '/api/templates';
      const method = editingTemplate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, corpo, isDefault }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar template.');

      setModalOpen(false);
      loadTemplates();
    } catch (err: any) {
      setFormError(err.message || 'Falha ao salvar template.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, templateTitulo: string) => {
    if (!confirm(`Deseja realmente excluir o template "${templateTitulo}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir template.');
      loadTemplates();
    } catch (err: any) {
      alert(err.message || 'Falha ao excluir template.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-miguetti-silver/30">
        <div>
          <h1 className="text-2xl font-bold font-display text-miguetti-dark">
            Configurações de Mensagens Padrão
          </h1>
          <p className="text-sm text-gray-600">
            Gerenciamento de múltiplos templates de mensagens padrão para WhatsApp com tags dinâmicas
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-miguetti-red text-white text-xs font-semibold hover:bg-miguetti-red-hover active:scale-[0.98] shadow-md shadow-miguetti-red/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Template de Mensagem
        </button>
      </div>

      {/* Guia de Tags Dinâmicas */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-miguetti-red/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-miguetti-red text-white rounded-xl shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-gray-700">
            <h4 className="font-bold text-sm text-miguetti-dark">
              Tags Dinâmicas Disponíveis para os Templates
            </h4>
            <p>
              Insira as tags abaixo no corpo do template. Durante o envio, elas serão substituídas
              automaticamente pelos dados reais do aluno/responsável:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
              <span className="px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-miguetti-red">
                {'{nome_aluno}'}
              </span>
              <span className="px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-miguetti-red">
                {'{destinatario}'}
              </span>
              <span className="px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-miguetti-red">
                {'{valor}'}
              </span>
              <span className="px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-miguetti-red">
                {'{vencimento}'}
              </span>
              <span className="px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-miguetti-red">
                {'{competencia}'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-miguetti-red mb-2" />
            Carregando templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            Nenhum template cadastrado ainda. Clique em "Novo Template de Mensagem" para começar.
          </div>
        ) : (
          templates.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                t.isDefault ? 'border-miguetti-red/60 ring-1 ring-miguetti-red/30' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-miguetti-red" />
                    <h3 className="font-bold text-sm text-miguetti-dark truncate">{t.titulo}</h3>
                  </div>
                  {t.isDefault && (
                    <span className="text-[10px] font-bold text-miguetti-red bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                      Padrão
                    </span>
                  )}
                </div>
                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 whitespace-pre-wrap font-sans mt-3 min-h-[100px]">
                  {t.corpo}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1.5 text-gray-500 hover:text-miguetti-red hover:bg-gray-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.titulo)}
                  disabled={deletingId === t.id}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  {deletingId === t.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Criar / Editar Template */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold font-display text-miguetti-dark">
                {editingTemplate ? 'Editar Template de Mensagem' : 'Novo Template de Mensagem'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
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

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Título do Template *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lembrete de Vencimento, Cobrança Amigável..."
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-miguetti-red focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Corpo da Mensagem *</label>
                  <span className="text-[11px] text-gray-400">Clique para inserir tag:</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2 font-mono text-[10px]">
                  {[
                    '{nome_aluno}',
                    '{destinatario}',
                    '{valor}',
                    '{vencimento}',
                    '{competencia}',
                  ].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleInsertTag(` ${tag} `)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-miguetti-red hover:text-white rounded text-gray-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={6}
                  value={corpo}
                  onChange={(e) => setCorpo(e.target.value)}
                  placeholder="Olá {destinatario}, informamos que a mensalidade de {nome_aluno} no valor de {valor}..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-miguetti-red focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-miguetti-red focus:ring-miguetti-red cursor-pointer"
                />
                <label htmlFor="chkDefault" className="text-gray-700 font-semibold cursor-pointer">
                  Definir este template como padrão para novas cobranças
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
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
                  className="px-5 py-2 rounded-lg bg-miguetti-red text-white font-semibold hover:bg-miguetti-red-hover flex items-center gap-1.5 shadow-md shadow-miguetti-red/20 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingTemplate ? 'Salvar Alterações' : 'Criar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

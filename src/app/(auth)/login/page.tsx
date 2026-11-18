'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpa cookies residuais no client se houver parâmetro from ou ao carregar a tela
  useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevenção de duplo clique (RULES.md §3.1)

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      // Redireciona para URL de origem (se segura) ou para o painel raiz /
      const targetUrl = fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//') ? fromParam : '/';
      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-miguetti-dark px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Detalhe de fundo em degradê com vermelho Miguetti */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-miguetti-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-miguetti-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-[#18181b] p-8 rounded-2xl border border-miguetti-silver/20 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-miguetti-red text-white shadow-lg shadow-miguetti-red/30 mb-4">
            <Image src="/images/logo-miguetti.png" alt="Logo" width={40} height={40} />
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            TKD MANAGER
          </h2>
          <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-miguetti-red/10 text-miguetti-red border border-miguetti-red/30">
            Acesso Exclusivo do Professor
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-miguetti-error/10 border border-miguetti-error/30 text-miguetti-error text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              E-mail do Professor
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@dominio.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#27272a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-miguetti-red focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#27272a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-miguetti-red focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium bg-miguetti-red hover:bg-miguetti-red-hover active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-miguetti-red/20 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autenticando...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-miguetti-dark text-white">
        <Loader2 className="w-8 h-8 animate-spin text-miguetti-red" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

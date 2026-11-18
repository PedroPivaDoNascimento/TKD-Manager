'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CircleDollarSign,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Alunos', href: '/alunos', icon: Users },
  { label: 'Financeiro', href: '/financeiro', icon: CircleDollarSign },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-miguetti-surface flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-miguetti-dark text-white px-4 py-3 flex items-center justify-between border-b border-miguetti-silver/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-miguetti-red flex items-center justify-center font-bold text-white">
            <Image src="/images/logo-miguetti.png" alt="Logo" width={20} height={20} />
          </div>
          <span className="font-display font-bold text-base tracking-wide text-white">
            MIGUETTI TEAM
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-miguetti-dark text-white border-r border-miguetti-silver/20 shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-miguetti-red flex items-center justify-center font-bold text-white shadow-lg shadow-miguetti-red/20">
            <Image src="/images/logo-miguetti.png" alt="Logo" width={24} height={24} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-wider uppercase text-white">
              TKD Manager
            </h1>
            <p className="text-[11px] text-miguetti-silver font-medium">Miguetti Team</p>
          </div>
        </div>

        <div className="px-4 py-3 bg-black/30 border-b border-gray-800/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-miguetti-red">
            Painel do Professor
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-miguetti-red text-white shadow-md shadow-miguetti-red/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:text-miguetti-red hover:bg-miguetti-red/10 transition-all disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Saindo...' : 'Encerrar Sessão'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-64 bg-miguetti-dark text-white p-5 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Image src="/images/logo-miguetti.png" alt="Logo" width={24} height={24} className="w-6 h-6 text-miguetti-red" />
                <span className="font-bold text-sm">TKD MANAGER</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-miguetti-red text-white'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

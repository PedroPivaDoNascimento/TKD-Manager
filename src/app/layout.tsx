import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TKD Manager | Centro de Treinamento Miguetti Team',
  description: 'Sistema de Gestão Interna para Academias de Taekwondo',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-miguetti-surface text-miguetti-dark antialiased">
        {children}
      </body>
    </html>
  );
}

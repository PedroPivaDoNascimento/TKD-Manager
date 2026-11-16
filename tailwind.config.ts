import type { Config } from 'tailwindcss';

/**
 * Tema oficial — Centro de Treinamento Miguetti Team (docs/DESIGN.md)
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        miguetti: {
          red: '#D91A1A',        // Primária (Vermelho Miguetti)
          'red-hover': '#B01212', // Primária Hover
          dark: '#111111',        // Secundária / Dark (Preto Tatame)
          surface: '#F4F5F7',     // Superfície Principal (Claro)
          card: '#FFFFFF',        // Superfície Card
          silver: '#C4C9D4',      // Borda Metálica (Prata)
          success: '#16A34A',     // Sucesso
          warning: '#F59E0B',     // Alerta
          error: '#DC2626',       // Erro
          whatsapp: '#25D366',    // Ação WhatsApp
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

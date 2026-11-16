/** @type {import('next').NextConfig} */
const nextConfig = {
  // Saída standalone obrigatória para o Dockerfile multi-stage de produção (Fase 6.1)
  output: 'standalone',
};

export default nextConfig;

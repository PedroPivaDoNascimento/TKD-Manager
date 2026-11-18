# Plano de Atualização de Identidade Visual (Logotipo Oficial)

**TKD Manager – Substituição do Ícone Genérico pelo Brasão Oficial (`logo miguetti sem fundo.png`)**

## ⚠️ Instruções Obrigatórias para Execução (LLM)

1. Antes de executar qualquer tarefa abaixo, leia obrigatoriamente `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e `@GEMINI.md`.
2. **Proteção de Arquivos:** **NÃO** altere, sobrescreva ou apague o arquivo `.gitignore` existente na raiz do projeto.
3. Execute as tarefas sequencialmente, respeitando as convenções do Next.js (App Router) e as diretrizes visuais definidas no `@DESIGN.md`.
4. À medida que concluir cada tarefa, atualize o status na tabela (`🔴 Não Iniciado` $\rightarrow$ `🟡 Em Andamento` $\rightarrow$ `🟢 Concluído`).
5. Ao finalizar todas as tarefas, registre as decisões no `@GEMINI.md` (como `ADR-010`) e atualize o contador de progresso.

## 📊 Métricas e Progresso Geral

* **Total de Tarefas:** 5
* **Concluídas:** 0 (0%)
* **Em Andamento:** 0 (0%)
* **Pendentes:** 5 (100%)

---

## 🛠️ Fases de Atualização de Branding e Assets

| # | Tarefa | Camada / Área | Prioridade | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 | **Organização de Assets (`public/images/`):** Localizar o arquivo `logo miguetti sem fundo.png` atualmente na raiz (`root`) do projeto, movê-lo para o diretório padrão de ativos estáticos do Next.js em `public/images/logo-miguetti.png` (aplicando nomenclatura *kebab-case* sem espaços para evitar problemas de encoding em URLs/builds) e remover o arquivo solto da raiz. | Infra / Assets | Crítica | 🔴 Não Iniciado |
| 1.2 | **Remoção do Ícone Genérico e Atualização da Sidebar:** Localizar o componente de navegação lateral (`Sidebar`) onde aparece o ícone de escudo vermelho genérico (Lucide `ShieldCheck` ou equivalente dentro de caixa vermelha), removê-lo completamente e renderizar a imagem oficial `/images/logo-miguetti.png` utilizando o componente `<Image />` do Next.js com proporções equilibradas (`object-contain`). | Frontend / UI | Crítica | 🔴 Não Iniciado |
| 1.3 | **Atualização da Tela de Login (`/login`):** Substituir o mesmo ícone genérico de escudo na tela de autenticação (`src/app/(auth)/login/page.tsx`) pelo brasão oficial `/images/logo-miguetti.png`, garantindo alto contraste sobre o fundo escuro/claro conforme o `@DESIGN.md`. | Frontend / UI | Crítica | 🔴 Não Iniciado |
| 1.4 | **Varredura Global e Favicon:** Realizar uma busca global no código-fonte (`src/`) por qualquer outra ocorrência remanescente desse ícone genérico de escudo/marca substituindo-o pela nova logo oficial, além de configurar o favicon/ícone da aba do navegador (`src/app/layout.tsx` ou `public/favicon.ico`) utilizando o brasão da Miguetti Team. | Frontend / UI | Alta | 🔴 Não Iniciado |
| 1.5 | **Validação (Dev & Prod) e Governança:** Executar `npm run build` e testar em modo de desenvolvimento (`npm run dev`) para garantir que o `next/image` carregue `/images/logo-miguetti.png` sem erros de rota ou quebra de layout. Atualizar `@DESIGN.md`, registrar `ADR-010` no `@GEMINI.md` e marcar todas as tarefas como concluídas. | QA / Governança | Crítica | 🔴 Não Iniciado |
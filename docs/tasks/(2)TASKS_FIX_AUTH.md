# Plano de Correção e Ajustes de Autenticação

**TKD Manager – Correção de Redirecionamento de Sessão, Configuração de Credenciais no .env e Validação Dev/Prod**

## ⚠️ Instruções Obrigatórias para Execução (LLM)

1. Antes de executar qualquer tarefa abaixo, leia obrigatoriamente `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e `@GEMINI.md`.

2. Execute as tarefas sequencialmente, mantendo estrita conformidade com os padrões **MVC, DAO, Service Layer e DTO/Zod**.

3. À medida que concluir cada tarefa, atualize o status na tabela (`🔴 Não Iniciado` $\rightarrow$ `🟡 Em Andamento` $\rightarrow$ `🟢 Concluído`).

4. Ao finalizar todas as tarefas, registre as decisões no `@GEMINI.md` e atualize o contador de progresso.

## 📊 Métricas e Progresso Geral

* **Total de Tarefas:** 5
* **Concluídas:** 5 (100%)
* **Em Andamento:** 0 (0%)
* **Pendentes:** 0 (0%)

---

## 🛠️ Fases de Correção e Ajustes

| # | Tarefa | Camada / Área | Prioridade | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 | **Migrar Credenciais Mestre para o `.env`:** Adicionar `MASTER_EMAIL` e `MASTER_PASSWORD` nas variáveis de ambiente, atualizando o `prisma/seed.ts` e o `auth.service.ts` para lerem diretamente do arquivo `.env` (com fallback seguro), garantindo que o login padrão utilize estritamente as variáveis configuradas. | Backend / Config | Crítica | 🟢 Concluído |
| 1.2 | **Corrigir Redirecionamento no Middleware (`middleware.ts`):** Garantir que qualquer tentativa de acesso sem autenticação válida redirecione o usuário estritamente para a tela de login (`/login?from=<url_original>`), evitando loops de redirecionamento infinito (*infinite redirect loops* no Firefox/Chrome). | Backend / Edge | Crítica | 🟢 Concluído |
| 1.3 | **Corrigir Tratamento de Erros e Sessão na Tela de Login (`/login`):** Garantir que a página de login receba corretamente a query string `from`, limpe cookies/tokens corrompidos ao carregar, exiba mensagens claras em caso de falha e redirecione o professor para o dashboard (`/`) após a autenticação bem-sucedida. | Frontend / UI | Crítica | 🟢 Concluído |
| 1.4 | **Corrigir Verificação de Sessão nos DAOs e Services / API Routes:** Revisar o tratamento de cookies HTTP-only (`token`) nas requisições do App Router (`/api/...`), garantindo que o acesso aos dados retorne `401 Unauthorized` de forma limpa em vez de quebrar a página quando o token expirar. | Backend / API | Alta | 🟢 Concluído |
| 1.5 | **Validação Completa (Desenvolvimento e Produção):** Testar rigorosamente a aplicação tanto em **modo de desenvolvedor (`npm run dev`)** quanto em **modo de produção (`npm run build` e Docker)**. Garantir que o login e o redirecionamento funcionem perfeitamente em ambos os ambientes, atualizando os guias no `README.md`. | QA / DevOps | Crítica | 🟢 Concluído |
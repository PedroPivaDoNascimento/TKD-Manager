# Plano de Implementação e Divisão de Tarefas

**TKD Manager – Setup Completo e Construção do Sistema Funcional (MVP)**

## ⚠️ Instruções Obrigatórias para Execução (LLM)

1. Antes de executar qualquer tarefa abaixo, leia obrigatoriamente `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e `@GEMINI.md`.

2. Execute as tarefas sequencialmente, mantendo estrita conformidade com os padrões **MVC, SOLID, DAO, Service Layer, DTO/Zod e Strategy Pattern**.

3. À medida que iniciar e concluir cada tarefa, atualize o status na tabela (`🔴 Não Iniciado` $\rightarrow$ `🟡 Em Andamento` $\rightarrow$ `🟢 Concluído`) e atualize os contadores de progresso abaixo.

4. Ao finalizar todas as fases, registre as decisões e alterações no `@GEMINI.md`.

## 📊 Métricas e Progresso Geral

* **Total de Tarefas:** 21

* **Concluídas:** 7 (33%)

* **Em Andamento:** 0 (0%)

* **Pendentes:** 14 (67%)

## 🚀 Fase 1: Setup Inicial, Infraestrutura e Banco de Dados

Configuração do projeto base, ambiente Docker e modelagem relacional com Prisma.

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 1.1 | Inicializar projeto Next.js (App Router, TypeScript, Tailwind CSS) e instalar dependências (`prisma`, `@prisma/client`, `zod`, `bcryptjs`, `jose`, `lucide-react`, `recharts`) | Setup | Crítica | 🟢 Concluído | 
| 1.2 | Criar `docker-compose.yml` com serviço PostgreSQL (ambiente dev) e configurar `.env.example` / `.env` com `DATABASE_URL` e `JWT_SECRET` | Infra / Docker | Crítica | 🟢 Concluído | 
| 1.3 | Criar `schema.prisma` modelando `Professor` (acesso único com login/senha), `Aluno` (com campo `matricula` único, `captadoPor` para rastreio de matrícula, faixa atual e data último exame), `Responsavel` (vinculado a alunos menores) e `Mensalidade` (valor em centavos `Int`, vencimento e status) | Database | Crítica | 🟢 Concluído | 
| 1.4 | Executar migrations iniciais (`npx prisma migrate dev`) e criar script `prisma/seed.ts` para popular o usuário Professor padrão e dados iniciais de teste | Database | Alta | 🔴 Não Iniciado | 

## 🔐 Fase 2: Módulo de Autenticação Exclusiva do Professor

Implementação do acesso restrito (login/senha apenas para o professor).

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 2.1 | Implementar `auth.dto.ts` (Zod), `auth.dao.ts` (busca de professor no Prisma) e `auth.service.ts` (validação de senha com `bcryptjs` e geração de sessão JWT) | Backend / Core | Crítica | 🟢 Concluído | 
| 2.2 | Criar rotas de API (`/api/auth/login`, `/api/auth/logout`) e `middleware.ts` no Next.js para proteger todas as rotas internas do painel administrativo | Backend / Edge | Crítica | 🟢 Concluído | 

## 🧠 Fase 3: Core Domain (DAOs, Services, DTOs e Strategy Pattern)

Construção da lógica de negócio desacoplada seguindo SOLID, DAO e Strategy.

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 3.1 | Implementar módulo de Professores (`professor.dto.ts`, `professor.dao.ts`, `professor.service.ts`) para gestão da equipe de instrutores | Backend / Core | Média | 🟢 Concluído | 
| 3.2 | Implementar módulo de Alunos e Responsáveis (`aluno.dto.ts`, `aluno.dao.ts`, `aluno.service.ts`), garantindo unicidade da `matricula`, registro de quem captou a matrícula (`captadoPor`) e obrigatoriedade de responsável para menores | Backend / Core | Crítica | 🟢 Concluído | 
| 3.3 | Implementar módulo Financeiro (`mensalidade.dto.ts`, `mensalidade.dao.ts`, `mensalidade.service.ts`) trabalhando estritamente com valores inteiros em centavos e atualização automática de status (`PAGO`, `PENDENTE`, `VENCIDO`) | Backend / Core | Crítica | 🔴 Não Iniciado | 
| 3.4 | Implementar **Strategy Pattern** para cobrança (`cobranca.interface.ts` e `whatsapp-link.strategy.ts`) gerando URLs `https://wa.me/...` formatadas com mensagem selecionada pelo professor e direcionada ao WhatsApp do aluno ou do responsável | Backend / Core | Crítica | 🔴 Não Iniciado | 
| 3.5 | Implementar módulo Analítico (`dashboard.dao.ts` e `dashboard.service.ts`) consolidando o total de alunos e agrupamento quantitativo por responsável pela matrícula | Backend / Core | Alta | 🔴 Não Iniciado | 

## 🌐 Fase 4: Controllers / API Routes (Next.js App Router)

Exposição limpa dos endpoints consumidos pela interface administrativa.

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 4.1 | Criar Controllers REST em `/api/alunos` e `/api/professores` validando payloads com Zod e delegando execução aos Services | Backend / API | Crítica | 🔴 Não Iniciado | 
| 4.2 | Criar Controllers REST em `/api/mensalidades` (incluindo endpoint para gerar links de cobrança WhatsApp em lote ou individual) e `/api/dashboard` | Backend / API | Crítica | 🔴 Não Iniciado | 

## 🎨 Fase 5: Frontend & UI/UX (Identidade Centro de Treinamento Miguetti Team)

Construção das telas responsivas (Mobile-First) aplicando a paleta oficial (`#D91A1A`, `#111111`, `#F4F5F7`, `#C4C9D4`).

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 5.1 | Configurar tema no Tailwind CSS com as cores oficiais da logo (`DESIGN.md`), tipografia (`Montserrat` / `Inter`) e layout base protegido (Sidebar/Navbar escura `#111111`) | Frontend / UI | Alta | 🔴 Não Iniciado | 
| 5.2 | Construir Tela de Login exclusiva do Professor (`/login`) com identidade visual da academia e prevenção de duplo clique | Frontend / UI | Crítica | 🔴 Não Iniciado | 
| 5.3 | Construir Dashboard Principal (`/`) exibindo KPIs de alunos, **Tabela e Gráfico de Total de Alunos por Responsável de Matrícula** e resumo financeiro | Frontend / UI | Alta | 🔴 Não Iniciado | 
| 5.4 | Construir telas de Gestão de Alunos (`/alunos`) com busca por matrícula/nome, badges coloridas das faixas de Taekwondo e formulário completo (Aluno + Responsável + Captador da Matrícula) | Frontend / UI | Crítica | 🔴 Não Iniciado | 
| 5.5 | Construir tela de Gestão de Professores (`/professores`) e tela Financeira (`/financeiro`) com filtros de inadimplência, seletor de mensagem personalizada e botão de disparo rápido para o WhatsApp (`#25D366`) | Frontend / UI | Crítica | 🔴 Não Iniciado | 

## 🐳 Fase 6: Containerização (Produção) e Documentação Obrigatória

Preparação para deploy em produção via Docker e geração do manual completo do projeto.

| \# | Tarefa | Camada / Área | Prioridade | Status | 
| :--- | :--- | :--- | :--- | :--- | 
| 6.1 | Criar `Dockerfile` multi-stage otimizado para produção do Next.js (`output: 'standalone'`) e atualizar `docker-compose.yml` para subir a aplicação completa + PostgreSQL em produção | DevOps / Docker | Alta | 🔴 Não Iniciado | 
| 6.2 | Validar build de produção (`npm run build`), execução de migrations e teste completo dos fluxos (Login, Cadastro com Matrícula, Gráficos, Mensalidades e Link WhatsApp) | QA / Validação | Crítica | 🔴 Não Iniciado | 
| 6.3 | **Criar obrigatoriamente o arquivo `README.md`** na raiz do projeto contendo: resumo do TKD Manager, arquitetura adotada, credenciais padrão do seed, **passo a passo para executar em modo desenvolvedor (via Node.js)** e **passo a passo para executar em modo produção (via Docker / Docker Compose)** | Documentação | Crítica | 🔴 Não Iniciado | 
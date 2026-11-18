# Plano de Refatoração: Remoção Total de Captadores / Responsáveis por Matrícula e Instrutores

**TKD Manager – Purga de Dados de Captação (Back-end, Banco de Dados e Front-end) para Operação de Professor Único**

## ⚠️ Instruções Obrigatórias para Execução (LLM)

1. Antes de executar qualquer tarefa abaixo, leia obrigatoriamente `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e `@GEMINI.md`.

2. Execute as tarefas sequencialmente, mantendo estrita conformidade com os padrões **MVC, DAO, Service Layer, DTO/Zod e Strategy Pattern**.

3. À medida que concluir cada tarefa, atualize o status na tabela (`🔴 Não Iniciado` $
ightarrow$ `🟡 Em Andamento` $
ightarrow$ `🟢 Concluído`).

4. Ao finalizar todas as tarefas, registre as decisões no `@GEMINI.md` (como `ADR-009`) e atualize o contador de progresso.

## 📊 Métricas e Progresso Geral

* **Total de Tarefas:** 6
* **Concluídas:** 6 (100%)
* **Em Andamento:** 0 (0%)
* **Pendentes:** 0 (0%)

---

## 🛠️ Fases de Remoção e Refatoração (Single-Professor Mode)

| # | Tarefa | Camada / Área | Prioridade | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 | **Limpeza do Banco de Dados (`schema.prisma` & Migrations):** Remover definitivamente do modelo `Aluno` o campo de referência/relacionamento ao responsável pela matrícula (`captadoPor` / `registered_by` / `professorId`) e limpar qualquer coluna ou relação de instrutores auxiliares no `schema.prisma` e no `prisma/seed.ts`, mantendo apenas o registro do Professor Mestre único. Gerar e aplicar a migration (`npx prisma migrate dev --name remove_captador_e_instrutores`). | Database / Prisma | Crítica | 🟢 Concluído |
| 1.2 | **Limpeza dos DTOs, DAOs e Services de Alunos (`aluno.*`):** Remover todas as validações Zod (`aluno.dto.ts`), queries (`aluno.dao.ts`) e regras de negócio (`aluno.service.ts`) que exijam, salvem ou retornem o dado de responsável pela matrícula/captador. | Backend / Core | Crítica | 🟢 Concluído |
| 1.3 | **Limpeza do Módulo Analítico (`dashboard.dao.ts` & `dashboard.service.ts`):** Remover do back-end do Dashboard o KPI de "Instrutores Ativos", a consulta de agrupamento de matrículas por responsável e qualquer payload relacionado à auditoria de captação. | Backend / Core | Alta | 🟢 Concluído |
| 1.4 | **Limpeza da Interface do Dashboard (`/`):** Remover do front-end o card/indicador de "Instrutores Ativos" e excluir completamente o gráfico e a tabela de "Auditoria de Matrículas por Responsável / Captador", reorganizando o layout visual com os KPIs essenciais (Total de Alunos, Receita/Pendências e Distribuição de Faixas). | Frontend / UI | Crítica | 🟢 Concluído |
| 1.5 | **Limpeza das Telas e Formulários de Alunos (`/alunos`):** Remover o campo de seleção/exibição de "Responsável pela Matrícula / Captador" dos modais de criação, edição, detalhes e colunas da tabela de alunos. *(Atenção: manter intacto o cadastro de Responsável Legal para alunos menores de idade).* | Frontend / UI | Crítica | 🟢 Concluído |
| 1.6 | **Validação Completa (Dev & Prod) e Governança:** Executar `npm run build` e testar em modo desenvolvedor (`npm run dev`) garantindo zero referências quebradas no TypeScript ou Prisma. Atualizar `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md` (removendo menções antigas a `captadoPor` e múltiplos instrutores), registrar `ADR-009` no `@GEMINI.md` e marcar todas as tarefas como concluídas. | QA / Governança | Crítica | 🟢 Concluído |
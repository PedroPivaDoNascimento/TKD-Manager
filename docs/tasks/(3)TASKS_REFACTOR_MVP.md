# Plano de Refinamento e Adequação do MVP

**TKD Manager – Ajustes de Usabilidade, CRUD Completo, Graduações Oficiais, Mensalidade Automática Baseada no Aluno, Cobrança em Massa e Mensagens WhatsApp Múltiplas (Com Disparo Assistido Seguro)**

## ⚠️ Instruções Obrigatórias para Execução (LLM)

1. Antes de executar qualquer tarefa abaixo, leia obrigatoriamente `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e `@GEMINI.md`.

2. Execute as tarefas sequencialmente, mantendo estrita conformidade com os padrões **MVC, DAO, Service Layer, DTO/Zod e Strategy Pattern**.

3. À medida que concluir cada tarefa, atualize o status na tabela (`🔴 Não Iniciado` $\rightarrow$ `🟡 Em Andamento` $\rightarrow$ `🟢 Concluído`).

4. Ao finalizar todas as tarefas, registre as decisões no `@GEMINI.md` e atualize o contador de progresso.

## 📊 Métricas e Progresso Geral

* **Total de Tarefas:** 11
* **Concluídas:** 11 (100%)
* **Em Andamento:** 0 (0%)
* **Pendentes:** 0 (0%)

---

## 🛠️ Fases de Refinamento e Novas Funcionalidades

| # | Tarefa | Camada / Área | Prioridade | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 | **Limpeza da UI de Perfil (Remoção do Nome Fixo):** Remover o subtítulo com o nome "Mestre Alexandre Miguetti" localizado abaixo do painel do professor na barra lateral (`Sidebar`), mantendo apenas a identidade visual limpa do *Centro de Treinamento Miguetti Team*. | Frontend / UI | Média | 🟢 Concluído |
| 1.2 | **Atualização das Graduações (Faixas do Taekwondo):** Atualizar o schema Prisma (`Aluno`), DTOs e formulários para suportar rigorosamente o espectro completo de graduações oficiais: Branca, Cinza, Amarela, Laranja, Verde, Roxa, Azul, Marrom, Vermelha, Vermelha Ponta Preta e Preta. | Database / Backend / Frontend | Alta | 🟢 Concluído |
| 1.3 | **Remoção do Módulo de Professores / Equipe:** Desativar/remover o menu "Professores & Equipe", rotas e tabelas associadas, visto que o sistema é operado exclusivamente por um único professor. | Backend / Frontend | Alta | 🟢 Concluído |
| 1.4 | **CRUD Completo de Alunos & Sincronização Financeira:** Implementar edição, remoção e visualização detalhada de alunos (incluindo o campo de **valor da mensalidade padrão cadastrado por aluno** em centavos). Garantir que ao cadastrar um novo aluno, o painel financeiro gere automaticamente a primeira mensalidade baseada exatamente no valor configurado para aquele aluno. | Backend / Frontend | Crítica | 🟢 Concluído |
| 1.5 | **CRUD Completo de Mensalidades:** Permitir que o professor cadastre múltiplas mensalidades por aluno, edite valores (em centavos), remova lançamentos e visualize o histórico financeiro completo de forma flexível. | Backend / Frontend | Crítica | 🟢 Concluído |
| 1.6 | **Geração de Mensalidades em Massa (Geral ou Selecionados com Valor Base):** Implementar funcionalidade financeira para o professor criar mensalidades em lote que afetem **todos os alunos** ou **alunos específicos selecionados**. O sistema deve utilizar automaticamente o **valor da mensalidade individual cadastrado no perfil de cada aluno**, permitindo definir se o lançamento é **único** ou **recorrente (mensal)**. | Backend / Frontend | Crítica | 🟢 Concluído |
| 1.7 | **Remoção de Elementos Obsoletos (Folha e Barra de Pesquisa):** Excluir o botão de "Gerar Folha do Mês" e a barra de pesquisa secundária na aba de financeiro (próxima ao filtro de status), simplificando a interface. | Frontend / UI | Média | 🟢 Concluído |
| 1.8 | **Painel de Configurações e Múltiplas Mensagens Padrão (N Templates):** Criar uma tela/aba de Configurações permitindo ao professor cadastrar, editar e remover **múltiplas mensagens padrão (N templates)** para o WhatsApp, utilizando tags dinâmicas (ex: `{nome_aluno}`, `{valor}`, `{vencimento}`). | Backend / Frontend | Alta | 🟢 Concluído |
| 1.9 | **Fluxo de Disparo Assistido via WhatsApp (Seguro Anti-Ban):** Implementar o Strategy Pattern otimizado para gerar links dinâmicos (`wa.me`) utilizando os N templates salvos. Na tela financeira, criar um painel de envio em lote guiado com *cooldown* visual (botões sequenciais e temporizador) para o professor disparar as cobranças de forma ágil sem que o WhatsApp bloqueie o número da academia por spam. | Backend / Service / UI | Crítica | 🟢 Concluído |
| 1.10 | **Validação Completa (QA) e Atualização de Documentação:** Executar `npm run build` e testes em ambiente dev/prod, atualizar o `README.md`, registrar ADR-008 no `@GEMINI.md` e marcar todas as tarefas como concluídas. | QA / DevOps | Crítica | 🟢 Concluído |
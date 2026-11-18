# 🧠 Project Memory (Memória do Projeto e Arquivo de Decisões)

**TKD Manager – Registro Histórico de Decisões de Arquitetura (ADR)**

| Campo | Informação |
| :--- | :--- |
| **Última Atualização** | Novembro de 2026 |
| **Fase Atual** | MVP 100% Concluído e Validado |
| **Status Geral** | Concluído / Pronto para Produção |

---

## 📌 Registros de Decisões de Arquitetura (ADRs)

### ADR-001 — Escolha da Stack e Padrões de Projeto
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Decisão:** Utilizar Next.js (App Router), TypeScript, Prisma e PostgreSQL, sob os padrões MVC, DAO, Service Layer e Strategy.

### ADR-002 — Escopo de Acesso Exclusivo para o Professor
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Decisão:** Autenticação restrita unicamente ao perfil de Professor/Mestre.

### ADR-003 — Modelo de Cobrança via WhatsApp sem Gateway de Pagamento
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Decisão:** Uso do Strategy Pattern para gerar links de redirecionamento `wa.me` para cobranças manuais.

### ADR-004 — Identidade Visual Baseada no Brasão Oficial da Academia
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Decisão:** Adoção da paleta oficial do *Centro de Treinamento Miguetti Team* (`#D91A1A`, `#111111`, `#C4C9D4`).

### ADR-005 — Inclusão de Campo de Matrícula e Dashboard Analítico de Captação
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Contexto:** Necessidade da cliente de visualizar métricas consolidadas em tabelas e gráficos sobre o total de alunos e quem realizou cada matrícula, além de padronizar um número de matrícula único por aluno.
- **Decisão:** Adicionar o campo `matricula` (identificador único) e o rastreio do captador (`registered_by` / `captadoPor`) na entidade de alunos, expondo esses dados em um Dashboard analítico com gráficos e tabelas dedicados na interface do professor.

### ADR-006 — Conclusão de Todos os Módulos do MVP e Containerização
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Contexto:** Finalização das tarefas pendentes de infraestrutura, API, UI e containerização.
- **Decisões Implementadas:**
  1. Criação do script de seed (`prisma/seed.ts`) com Mestre Alexandre, instrutores auxiliares, alunos de teste com matrícula única e lançamentos financeiros em centavos.
  2. Implementação completa dos DAOs e Services de Mensalidades (`mensalidade.dao.ts`, `mensalidade.service.ts`) e Dashboard (`dashboard.dao.ts`, `dashboard.service.ts`).
  3. Implementação do **Strategy Pattern** para cobrança via WhatsApp (`whatsapp-link.strategy.ts` implementando `ICobrancaStrategy`).
  4. Implementação de todas as API Routes REST sob `src/app/api/` com validações Zod e desacoplamento de negócio.
  5. Construção de todas as interfaces no padrão Next.js App Router com Tailwind CSS e paleta oficial Miguetti Team:
     - `/login`: Autenticação restrita com prevenção de duplo clique;
     - `/`: Dashboard analítico com KPIs, tabela e gráfico Recharts de auditoria de matrículas por captador e graduação de faixas;
     - `/alunos`: Listagem com badges de faixa, filtros e modal com validação de menor de idade e seleção de captador;
     - `/financeiro`: Controle em centavos, geração de folha mensal e disparos em lote wa.me;
     - `/professores`: Gestão do corpo docente e captadores.
  6. Dockerfile multi-stage com compilação standalone do Next.js e criação do arquivo obrigatório `README.md`.

### ADR-007 — Correção Definitiva de Autenticação e Redirecionamento de Sessão
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Contexto:** Identificados loops de redirecionamento infinito para usuários não autenticados, ausência de tratamento para `/` no matcher do middleware, e necessidade de centralizar credenciais mestre no `.env`.
- **Decisões Implementadas:**
  1. **Credenciais Mestre no `.env`:** Variáveis `MASTER_EMAIL` e `MASTER_PASSWORD` adicionadas ao `.env` e `.env.example`. Sincronização automática em `AuthService` e `prisma/seed.ts`.
  2. **Eliminação de Loops no `middleware.ts`:**
     - Matcher abrangente protegendo `/` e todas as rotas internas, exceto assets estáticos e `/api/auth/login`.
     - Usuários não autenticados redirecionados para `/login?from=<origem>`.
     - Tentativas de acesso a rotas `/api/*` sem sessão retornam estritamente `401 Unauthorized` JSON.
     - Limpeza explícita do cookie `tkd_session` em caso de token inválido/expirado para evitar loop no Edge Runtime.
     - Usuários autenticados acessando `/login` redirecionados para a tela inicial `/`.
  3. **Ajuste na Tela de Login (`/login`):**
     - Leitura do parâmetro `from` para redirecionamento após autenticação.
     - Limpeza preventiva de cookies residuais ao carregar a página.
     - Encapsulamento em `<Suspense>` para evitar *de-opt* de SSR no Next.js 14.
  4. **Validação Dev e Prod:**
     - Testado em modo de produção (`npm run build` e `next start`).
     - Testado em modo de desenvolvimento (`npm run dev`).
     - Zero loops e validação total dos endpoints com e sem cookie de sessão.

### ADR-008 — Refatoração Completa do MVP: Usabilidade, CRUDs, Graduações Oficiais e Cobrança Assistida
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Contexto:** Adequação do sistema para operação de único professor mestre, refinamento de UI, expansão do espectro de graduações oficiais de Taekwondo, CRUDs flexíveis de alunos e mensalidades com sincronização automática baseada no valor individual de cada aluno, criação de mensalidades em lote e disparador assistido seguro de cobrança via WhatsApp com N templates configuráveis.
- **Decisões Implementadas:**
  1. **Limpeza e Ajuste de UI:** Remoção do subtítulo fixo na Sidebar. Remoção de tela e links de Professores & Equipe, e eliminação de elementos obsoletos no financeiro (botão de folha e campo de busca secundário).
  2. **Graduações Oficiais:** Enum `Graduacao` atualizado com 11 faixas oficiais (Branca, Cinza, Amarela, Laranja, Verde, Roxa, Azul, Marrom, Vermelha, Vermelha Ponta Preta e Preta) com identificação visual por cores e badges no dashboard e listagens.
  3. **Valor da Mensalidade Padrão por Aluno & Geração Automática:** Campo `valorMensalidadePadrao` no perfil de cada aluno. Cadastro de novo aluno gera automaticamente sua primeira mensalidade com esse valor.
  4. **CRUD Completo de Alunos & Mensalidades:** Edição, remoção, detalhes completos e gerenciamento individual e em massa de mensalidades.
  5. **Lançamento em Massa Flexível:** Endpoint e interface para gerar mensalidades para todos os alunos ou selecionados com base no valor individual, opção única ou recorrente (mensal).
  6. **N Templates Dinâmicos de Cobrança (`TemplateMensagem`):** Gestão completa de mensagens de WhatsApp com interpolação de tags dinâmicas sob `/configuracoes`.
  7. **Disparo Assistido via WhatsApp (Anti-Ban Safe):** Painel interativo com links `wa.me`, temporizador/cooldown configurável e navegação sequencial para mitigar risco de bloqueio de spam.
  8. **Homologação:** Build estático de produção compilado com sucesso (`npm run build`).

### ADR-009 — Purga Definitiva de Captadores de Matrícula e Adequação ao Modelo de Professor Único
- **Data:** Novembro de 2026
- **Status:** ✅ Aceito
- **Contexto:** O modelo de negócio do Centro de Treinamento Miguetti Team é estritamente centralizado no Professor Mestre único. A existência de captadores de matrícula, múltiplos instrutores para auditoria e rateio gerava sobrecarga cognitiva desnecessária, complexidade no banco de dados e ruído nas interfaces.
- **Decisões Implementadas:**
  1. **Banco de Dados & Prisma:**
     - Remoção das colunas `captado_por_id` e `captado_por_nome` da tabela `alunos` e `professor_id` da tabela `mensalidades`.
     - Remoção do relacionamento `alunosCaptados` no modelo `Professor` e relação com mensalidades.
     - Aplicação da migration `20261117114511_remove_captador_e_instrutores`.
     - Atualização do `prisma/seed.ts` mantendo apenas o Professor Mestre principal, sem instrutores auxiliares ou dados de captação.
  2. **Back-end (DTOs, DAOs e Services):**
     - Remoção dos campos `captadoPorId` e `captadoPorNome` do `alunoBaseSchema` e refinamento Zod de captação em `aluno.dto.ts`.
     - Limpeza das queries no `aluno.dao.ts`, `aluno.service.ts` e `mensalidade.dao.ts`.
     - Limpeza no `dashboard.dao.ts` e `dashboard.service.ts`: remoção do método `getAlunosPorCaptador`, remoção do KPI de `totalProfessores` (Instrutores Ativos) e tipos associados.
     - Ajuste no `professor.dao.ts` removendo include de contagem de alunos captados.
  3. **Front-end (Dashboard `/` e Alunos `/alunos`):**
     - Dashboard (`/`): exclusão do card de "Instrutores Ativos", remoção total da tabela e gráfico de barras "Auditoria de Matrículas por Responsável / Captador". Reorganização do grid com os KPIs operacionais essenciais (Total de Alunos, Arrecadação Confirmada, Inadimplência) e a distribuição por Faixa de Taekwondo.
     - Alunos (`/alunos`): remoção das opções de seleção de captador (Professor/Externo) no formulário modal de criação/edição, remoção da coluna de captador na tabela de listagem e remoção do bloco na visualização detalhada.
     - Preservação integral do cadastro de *Responsável Legal* para alunos menores de 18 anos.
  4. **Governança e Validação:**
     - Atualização de `@RULES.md`, `@PRD.md`, `@ARCHITECTURE.md`, `@DESIGN.md` e status em `@(4)TASKS_REMOVE_CAPTADOR.md`.
     - Compilação estática (`npm run build`) e ambiente de desenvolvimento testados com 100% de sucesso e zero erros de tipagem.

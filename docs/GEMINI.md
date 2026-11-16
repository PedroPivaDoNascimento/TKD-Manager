# 🧠 Project Memory (Memória do Projeto e Arquivo de Decisões)

**TKD Manager – Registro Histórico de Decisões de Arquitetura (ADR)**

| Campo | Informação |
| :--- | :--- |
| **Última Atualização** | Novembro de 2026 |
| **Fase Atual** | Refinamento do MVP com Requisitos Analíticos |
| **Status Geral** | Em Desenvolvimento |

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
- **Decisão:** Adicionar o campo `matricula` (identificador único) e o rastreio do captador (`registered_by`) na entidade de alunos, expondo esses dados em um Dashboard analítico com gráficos e tabelas dedicados na interface do professor.

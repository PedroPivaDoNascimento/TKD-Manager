# Arquitetura do Sistema – TKD Manager

Este documento detalha a arquitetura técnica baseada em **Next.js (App Router), TypeScript, Prisma ORM e PostgreSQL**, aplicando os padrões **MVC, SOLID, DAO, Service Layer e Strategy**.

---

## 1. Estrutura de Pastas e Camadas

```text
src/
├── app/                        # VIEW & CONTROLLERS (Next.js App Router)
│   ├── (auth)/                 # Tela de Login (Exclusiva para o Professor)
│   ├── (dashboard)/            # Painel administrativo protegido (Alunos, Dashboard Analítico, Financeiro)
│   └── api/                    # API Routes (Controllers que chamam Services)
│
└── modules/                    # NÚCLEO DA APLICAÇÃO (Domain & Business Logic)
    ├── auth/                   # Módulo de autenticação
    ├── alunos/
    │   ├── aluno.dto.ts        # Schemas Zod (inclui validação de matricula e registeredBy)
    │   ├── aluno.dao.ts        # DAO (Prisma Client queries + agregações para gráficos)
    │   └── aluno.service.ts    # Regras de negócio de alunos
    ├── dashboard/              # Módulo de métricas para tabelas e gráficos
    │   ├── dashboard.dao.ts
    │   └── dashboard.service.ts
    ├── professores/
    │   ├── professor.dao.ts
    │   └── professor.service.ts
    └── financeiro/
        ├── mensalidade.dao.ts
        ├── mensalidade.service.ts
        └── strategies/         # Strategy Pattern para WhatsApp
            ├── cobranca.interface.ts
            └── whatsapp-link.strategy.ts
```

## 2. Modelagem de Dados Chave (Prisma / PostgreSQL)

Tabela Alunos: Deve conter obrigatoriamente a coluna matricula (String, Unique) e a coluna registered_by (ou captado_por), permitindo alimentar as consultas de agregação para a tabela e o gráfico de total de alunos por responsável de matrícula.

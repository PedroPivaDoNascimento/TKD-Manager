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
    │   ├── aluno.dto.ts        # Schemas Zod (validação de matricula única e dados cadastrais)
    │   ├── aluno.dao.ts        # DAO (Prisma Client queries de alunos e responsáveis)
    │   └── aluno.service.ts    # Regras de negócio de alunos (menor de idade, primeira mensalidade)
    ├── dashboard/              # Módulo de métricas do painel
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

Tabela Alunos: Deve conter obrigatoriamente a coluna `matricula` (String, Unique), vínculo com responsável legal (para alunos menores de 18 anos) e controle de mensalidade padrão em centavos. Acesso restrito ao perfil único de Professor Mestre.

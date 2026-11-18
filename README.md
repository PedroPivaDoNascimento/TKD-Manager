# 🥋 TKD Manager

> **Sistema de Gestão Interna para Academias de Taekwondo**  
> *Identidade Oficial: Centro de Treinamento Miguetti Team*

---

## 📌 Visão Geral do Projeto

O **TKD Manager** é um sistema web de gestão operacional desenhado especificamente para o **Professor / Mestre (Sabomim)**. Ele centraliza o cadastro de atletas com número de **matrícula único**, vínculo e auditoria de quem realizou a captação da matrícula (`captadoPor`), controle de graduações de faixas, gestão financeira com valores estritamente em centavos e régua de cobrança rápida com redirecionamento via WhatsApp (`wa.me`).

### 🛡️ Perfil de Acesso Exclusivo
- Acesso restrito unicamente ao **Professor / Mestre**.
- Alunos e responsáveis **não possuem credenciais de acesso** ao sistema.

---

## 🏗️ Arquitetura e Padrões Adotados

O projeto adota uma arquitetura em camadas no **Next.js (App Router)** com **TypeScript**, **Prisma ORM** e **PostgreSQL**:

```text
src/
├── app/                        # VIEW & CONTROLLERS (App Router)
│   ├── (auth)/                 # Autenticação exclusiva do Professor
│   ├── (dashboard)/            # Telas protegidas (Dashboard, Alunos, Financeiro, Configurações)
│   └── api/                    # Controllers REST (validação Zod e delegação aos Services)
│
├── modules/                    # CORE DOMAIN & BUSINESS LOGIC
│   ├── auth/                   # Sessão e tokens JWT seguros (jose)
│   ├── alunos/                 # DTOs Zod, DAO e Service Layer de alunos e responsáveis
│   ├── financeiro/             # Gestão em centavos, DAO, Service e Strategy wa.me
│   │   └── strategies/         # Strategy Pattern (cobranca.interface.ts, whatsapp-link.strategy.ts)
│   ├── configuracoes/          # Gestão de N Templates dinâmicos para mensagens de cobrança
│   └── dashboard/              # Métricas e agregações para gráficos e tabelas
│
└── lib/                        # Utilitários (Prisma Client singleton, formatadores de centavos, erros)
```

### ⚡ Regras Técnicas Inegociáveis
1. **Manipulação Monetária:** Todo valor monetário é armazenado e processado como inteiro em **centavos** (`Int`). Ex: `R$ 150,00` é salvo como `15000`.
2. **Strategy Pattern:** Disparos de mensagens via WhatsApp utilizam a interface `ICobrancaStrategy` desacoplada.
3. **Prevenção de Duplo Clique:** Botões com estado de submissão bloqueados e loaders para evitar duplicação.
4. **Identidade Visual:** Paleta oficial Miguetti Team (`#D91A1A`, `#111111`, `#F4F5F7`, `#C4C9D4`).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** 18+ (recomendado Node 20 LTS) e **npm**
- **Neon CLI** (`npm i -g neon@latest`) para gerenciamento do banco na nuvem **OU** **Docker** para banco local

---

### 1️⃣ Modo com Banco Neon Serverless (Recomendado)

O projeto está configurado nativamente com **Neon Postgres**. O Prisma utiliza pooler (`DATABASE_URL`) para as requisições web e conexão direta (`DATABASE_URL_UNPOOLED`) para migrações.

1. **Clonar e instalar dependências:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd "TKD Manager"
   npm install
   ```

2. **Autenticar e puxar as variáveis do Neon:**
   ```bash
   neon login
   neon env pull
   ```
   *Ou configure manualmente `.env` com `DATABASE_URL` (pooled) e `DATABASE_URL_UNPOOLED` (direta).*

3. **Executar migrações e popular banco de dados (Seed):**
   ```bash
   npm run db:deploy
   npm run db:seed
   ```

4. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

---

### 2️⃣ Modo Desenvolvedor Local (Docker)

Caso queira rodar um PostgreSQL local via Docker sem Neon:

1. **Clonar e instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente (`.env`):**
   ```bash
   cp .env.example .env
   ```
   Defina `DATABASE_URL` e `DATABASE_URL_UNPOOLED` apontando para o PostgreSQL local:
   `postgresql://tkd:tkd_secret@localhost:5432/tkd_manager?schema=public`

3. **Subir o banco PostgreSQL via Docker:**
   ```bash
   docker compose up -d postgres
   ```

4. **Executar migrações do Prisma e Seed:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

---

### 3️⃣ Modo Produção (Container Completo com Docker Compose)

Para rodar todo o ecossistema (App Next.js Standalone + Banco PostgreSQL) encapsulado em containers:

1. **Configurar o `.env` de produção:**
   ```bash
   cp .env.example .env
   # Ajuste o JWT_SECRET para uma chave segura de produção
   ```

2. **Construir a imagem e subir os serviços com o perfil `production`:**
   ```bash
   docker compose --profile production up -d --build
   ```

3. **Aplicar migrações e seed no container (primeira execução):**
   ```bash
   docker exec -it tkd-manager-app npx prisma migrate deploy
   docker exec -it tkd-manager-app npm run db:seed
   ```

4. **Acessar a aplicação:**
   Acesse em: [http://localhost:3000](http://localhost:3000)

---


## 🧪 Scripts Disponíveis no `package.json`

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Next.js em modo desenvolvimento |
| `npm run build` | Gera o build otimizado de produção (`standalone`) |
| `npm run start` | Inicia o servidor Next.js compilado |
| `npm run db:migrate` | Cria e aplica migrações do Prisma |
| `npm run db:seed` | Popula o banco com instrutores, alunos e mensalidades |
| `npm run db:studio` | Abre o painel visual Prisma Studio no navegador |

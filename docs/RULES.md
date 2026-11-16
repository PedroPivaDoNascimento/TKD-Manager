# Regras de Desenvolvimento e Padrões de Código

**TKD Manager – Diretrizes Estruturais e Boas Práticas**

--- 

## Observação Importante!!!
1. Antes de começar qualquer task ou alteração no código fonte, é necessário realizar a **leitura obrigatória** dos arquivos `@ARCHITECTURE.md`, `@DESIGN.md`, `@PRD.md`, garantindo que a task ou alteração siga os requisitos estabelecidos.
2. **Proteção do `.gitignore`:** É **estritamente proibido** alterar, sobrescrever ou excluir o arquivo `.gitignore` existente na raiz do projeto. Ele já está devidamente configurado para proteger credenciais e artefatos de build.
3. Após o término das tarefas, atualizar o status correspondente no arquivo `@TASKS_SETUP.md` e registrar decisões relevantes no `@GEMINI.md`.

---

## 1. Padrões de Arquitetura e Organização (MVC + DAO + Service + Strategy)
1. **Separação de Camadas Estrita:**
   * **Controllers / Server Actions (Next.js):** Apenas recebem a requisição HTTP, validam os dados de entrada e repassam para o `Service`. Nenhuma regra de negócio ou query de banco pode residir no Controller.
   * **Service Layer:** Onde residem todas as regras de negócio (ex: cálculo de vencimentos, validação de menor de idade para direcionar dados de cobrança ao responsável, e agregação de dados para os gráficos analíticos).
   * **DAO (Data Access Object):** Camada isolada responsável por interagir diretamente com o **Prisma ORM**. Nenhuma query SQL/Prisma fora dos DAOs.
   * **Strategy Pattern:** Utilizado obrigatoriamente para os módulos que possuem múltiplas formas de execução, como o sistema de notificações e cobrança via WhatsApp (`WhatsAppLinkStrategy`, etc.).

2. **Validação de Tipos com DTO e Zod:**
   * Todas as entradas de dados (formulários, requisições de API) DEVEM possuir um DTO validado por schemas do **Zod** em tempo de execução, incluindo obrigatoriamente o campo de **matrícula** e a referência do responsável pela captação.

3. **Regra de Autenticação e Acesso Exclusivo:**
   * O sistema possui **apenas um tipo de usuário autenticado: o Professor / Mestre**. Alunos e responsáveis **não possuem** login, senha ou acesso à plataforma.

---

## 2. Regras de Manipulação de Valores Monetários
1. **NUNCA UTILIZE `float` OU `double` PARA VALORES MONETÁRIOS.**[cite: 1]
   * Todos os valores de mensalidades e taxas devem ser processados e armazenados como **inteiros representando centavos** (ex: R$ $150{,}00 \rightarrow 15000$)[cite: 1].

---

## 3. Padrões no Frontend (Next.js & Tailwind)
1. **Prevenção de Duplo Clique:**
   * Desabilitar botões de salvamento e envio imediatamente após o primeiro clique para evitar duplicação de cadastros ou disparos repetidos no WhatsApp[cite: 1].
2. **Responsividade Mobile-First:**
   * Como o sistema será acessado na beira do tatame pelo professor via tablet ou celular, todas as telas, tabelas e gráficos devem se adaptar perfeitamente a dispositivos móveis.
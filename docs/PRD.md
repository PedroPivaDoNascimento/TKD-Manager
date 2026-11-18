# Documento de Requisitos do Produto (PRD)

**TKD Manager – Sistema de Gestão Interna para Academias de Taekwondo**

| Campo | Valor |
| :--- | :--- |
| **Versão** | 1.1.0-MVP |
| **Data** | Novembro de 2026 |
| **Status** | Aprovado para Implementação |

---

## 1. Visão Geral do Produto
O **TKD Manager** é um software web de gestão interna e exclusiva para o **Professor / Mestre** de academias de Taekwondo. Ele centraliza o cadastro de alunos (contendo número de **matrícula** único), responsáveis, controle de graduações, acompanhamento financeiro e relatórios analíticos de desempenho da academia.

## 2. Objetivos Principais
* Oferecer um painel administrativo seguro, protegido por login e senha, acessível exclusivamente pelo professor.
* Controlar fichas de alunos com identificador exclusivo de **matrícula**.
* Exibir um painel analítico (Dashboard com indicadores e faixas) contendo o total de alunos ativos, arrecadação, inadimplência e graduações.
* Gerenciar mensalidades e datas de vencimento, facilitando o disparo de lembretes de cobrança via WhatsApp.

## 3. Perfil de Acesso Único
* **Professor / Mestre (Sabonim / Administrador):** Único usuário com credenciais de acesso ao sistema.

## 4. Requisitos Funcionais
1. **Autenticação Segura:** Tela de login restrita para validação das credenciais do professor.
2. **Gestão de Alunos com Matrícula Única:** Cadastro completo contendo:
   * Número de **matrícula** único.
   * Dados do aluno e faixa atual.
   * Vínculo com responsável (obrigatório se menor de idade).
3. **Dashboard Analítico:** Seção visual na tela inicial contendo:
   * Total geral de alunos matriculados (ativos e inativos).
   * Arrecadação confirmada e inadimplência em centavos.
   * Distribuição de alunos por faixa de graduação de Taekwondo.
4. **Controle Financeiro de Mensalidades:** Lançamento de mensalidades com status (*Pago*, *Pendente*, *Vencido*).
5. **Disparo de Mensagens via WhatsApp (Strategy Pattern):** Geração de links automáticos (`wa.me`) para cobrança de inadimplentes com um clique.

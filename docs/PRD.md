# Documento de Requisitos do Produto (PRD)

**TKD Manager – Sistema de Gestão Interna para Academias de Taekwondo**

| Campo | Valor |
| :--- | :--- |
| **Versão** | 1.1.0-MVP |
| **Data** | Novembro de 2026 |
| **Status** | Aprovado para Implementação |

---

## 1. Visão Geral do Produto
O **TKD Manager** é um software web de gestão interna e exclusiva para o **Professor / Mestre** de academias de Taekwondo. Ele centraliza o cadastro de alunos (contendo número de **matrícula** e o responsável pela captação), responsáveis, controle de graduações, acompanhamento financeiro e relatórios analíticos em gráficos/tabelas de desempenho de matrículas.

## 2. Objetivos Principais
* Oferecer um painel administrativo seguro, protegido por login e senha, acessível exclusivamente pelo professor.
* Controlar fichas de alunos com identificador exclusivo de **matrícula** e vínculo de quem realizou a captação do aluno.
* Exibir um painel analítico (Dashboard com gráficos e tabelas) contendo o total de alunos ativos e o volume de matrículas captadas por responsável.
* Gerenciar mensalidades e datas de vencimento, facilitando o disparo de lembretes de cobrança via WhatsApp.

## 3. Perfil de Acesso Único
* **Professor / Mestre (Sabonim / Administrador):** Único usuário com credenciais de acesso ao sistema.

## 4. Requisitos Funcionais
1. **Autenticação Segura:** Tela de login restrita para validação das credenciais do professor.
2. **Gestão de Alunos com Matrícula e Captação:** Cadastro completo contendo:
   * Número de **matrícula** único.
   * Dados do aluno e faixa atual.
   * Campo indicando **quem efetuou/pegou a matrícula** do aluno.
   * Vínculo com responsável (obrigatório se menor de idade).
3. **Dashboard Analítico (Tabelas e Gráficos):** Seção visual na tela inicial contendo:
   * Total geral de alunos matriculados.
   * Tabela e gráfico estatístico agrupando a quantidade de alunos por responsável que efetuou a matrícula.
4. **Controle Financeiro de Mensalidades:** Lançamento de mensalidades com status (*Pago*, *Pendente*, *Vencido*).
5. **Disparo de Mensagens via WhatsApp (Strategy Pattern):** Geração de links automáticos (`wa.me`) para cobrança de inadimplentes com um clique.

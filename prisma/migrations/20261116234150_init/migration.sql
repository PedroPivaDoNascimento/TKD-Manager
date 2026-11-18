-- CreateEnum
CREATE TYPE "FaixaGraduacao" AS ENUM ('BRANCA', 'AZUL', 'AMARELA', 'VERDE', 'MARROM', 'PRETA');

-- CreateEnum
CREATE TYPE "StatusMensalidade" AS ENUM ('PAGO', 'PENDENTE', 'VENCIDO');

-- CreateEnum
CREATE TYPE "StatusAluno" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "professores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "graduacao" TEXT NOT NULL DEFAULT 'Faixa Preta 1º Dan',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL DEFAULT 'Responsável Legal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responsaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "faixa_atual" "FaixaGraduacao" NOT NULL DEFAULT 'BRANCA',
    "data_ultimo_exame" TIMESTAMP(3),
    "status" "StatusAluno" NOT NULL DEFAULT 'ATIVO',
    "captado_por_nome" TEXT,
    "captado_por_id" TEXT,
    "responsavel_id" TEXT,
    "valor_mensalidade_cents" INTEGER NOT NULL DEFAULT 15000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensalidades" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "professor_id" TEXT,
    "competencia" TEXT NOT NULL,
    "valor_cents" INTEGER NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "status" "StatusMensalidade" NOT NULL DEFAULT 'PENDENTE',
    "pago_em" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensalidades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professores_email_key" ON "professores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_matricula_key" ON "alunos"("matricula");

-- CreateIndex
CREATE INDEX "alunos_captado_por_id_idx" ON "alunos"("captado_por_id");

-- CreateIndex
CREATE INDEX "alunos_status_idx" ON "alunos"("status");

-- CreateIndex
CREATE INDEX "mensalidades_status_idx" ON "mensalidades"("status");

-- CreateIndex
CREATE INDEX "mensalidades_vencimento_idx" ON "mensalidades"("vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "mensalidades_aluno_id_competencia_key" ON "mensalidades"("aluno_id", "competencia");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_captado_por_id_fkey" FOREIGN KEY ("captado_por_id") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "responsaveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensalidades" ADD CONSTRAINT "mensalidades_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensalidades" ADD CONSTRAINT "mensalidades_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

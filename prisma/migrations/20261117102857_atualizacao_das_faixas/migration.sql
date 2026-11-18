-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FaixaGraduacao" ADD VALUE 'CINZA';
ALTER TYPE "FaixaGraduacao" ADD VALUE 'LARANJA';
ALTER TYPE "FaixaGraduacao" ADD VALUE 'ROXA';
ALTER TYPE "FaixaGraduacao" ADD VALUE 'VERMELHA';
ALTER TYPE "FaixaGraduacao" ADD VALUE 'VERMELHA_PONTA_PRETA';

-- DropIndex
DROP INDEX "mensalidades_aluno_id_competencia_key";

-- CreateTable
CREATE TABLE "mensagem_templates" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagem_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mensalidades_aluno_id_idx" ON "mensalidades"("aluno_id");

-- CreateIndex
CREATE INDEX "mensalidades_competencia_idx" ON "mensalidades"("competencia");

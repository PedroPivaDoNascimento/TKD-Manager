/*
  Warnings:

  - You are about to drop the column `captado_por_id` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `captado_por_nome` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `mensalidades` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_captado_por_id_fkey";

-- DropForeignKey
ALTER TABLE "mensalidades" DROP CONSTRAINT "mensalidades_professor_id_fkey";

-- DropIndex
DROP INDEX "alunos_captado_por_id_idx";

-- AlterTable
ALTER TABLE "alunos" DROP COLUMN "captado_por_id",
DROP COLUMN "captado_por_nome";

-- AlterTable
ALTER TABLE "mensalidades" DROP COLUMN "professor_id";

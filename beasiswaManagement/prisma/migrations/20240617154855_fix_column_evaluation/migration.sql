/*
  Warnings:

  - You are about to alter the column `weightValue` on the `Evaluation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Evaluation` MODIFY `weightValue` DOUBLE NULL;

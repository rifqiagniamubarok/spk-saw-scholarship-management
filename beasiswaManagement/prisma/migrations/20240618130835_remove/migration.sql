/*
  Warnings:

  - You are about to drop the `CriteriaOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CriteriaOption` DROP FOREIGN KEY `CriteriaOption_criteriaId_fkey`;

-- DropTable
DROP TABLE `CriteriaOption`;

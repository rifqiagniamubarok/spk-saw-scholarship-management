/*
  Warnings:

  - You are about to drop the column `achivement` on the `Achievement` table. All the data in the column will be lost.
  - Added the required column `achievement` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Achievement` DROP COLUMN `achivement`,
    ADD COLUMN `achievement` VARCHAR(191) NOT NULL;

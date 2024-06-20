/*
  Warnings:

  - You are about to drop the column `semeseter` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `semester` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Grade` DROP COLUMN `semeseter`,
    ADD COLUMN `semester` INTEGER NOT NULL;

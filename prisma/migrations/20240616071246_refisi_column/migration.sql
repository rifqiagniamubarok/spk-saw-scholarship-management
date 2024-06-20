/*
  Warnings:

  - You are about to alter the column `nim` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `dob` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.
  - You are about to alter the column `father_income` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `mother_income` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Student` MODIFY `nim` INTEGER NOT NULL,
    MODIFY `pob` VARCHAR(191) NULL,
    MODIFY `dob` DATE NULL,
    MODIFY `address` TEXT NULL,
    MODIFY `father_name` VARCHAR(191) NULL,
    MODIFY `father_job` VARCHAR(191) NULL,
    MODIFY `father_income` INTEGER NULL,
    MODIFY `mother_name` VARCHAR(191) NULL,
    MODIFY `mother_job` VARCHAR(191) NULL,
    MODIFY `mother_income` INTEGER NULL,
    MODIFY `gpa` DOUBLE NULL,
    MODIFY `evaluation_status` VARCHAR(191) NULL DEFAULT 'not_sent';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'student';

-- CreateIndex
CREATE UNIQUE INDEX `Achievement_id_key` ON `Achievement`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Grade_id_key` ON `Grade`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_id_key` ON `Student`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

/*
  Warnings:

  - You are about to drop the column `student_id` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `cumulative_gp` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_status` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `father_income` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `father_job` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `father_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `mother_income` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `mother_job` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `mother_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cumulativeGpa` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Achievement` DROP FOREIGN KEY `Achievement_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Grade` DROP FOREIGN KEY `Grade_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_user_id_fkey`;

-- AlterTable
ALTER TABLE `Achievement` DROP COLUMN `student_id`,
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Grade` DROP COLUMN `cumulative_gp`,
    DROP COLUMN `student_id`,
    ADD COLUMN `cumulativeGpa` DOUBLE NOT NULL,
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `evaluation_status`,
    DROP COLUMN `father_income`,
    DROP COLUMN `father_job`,
    DROP COLUMN `father_name`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `mother_income`,
    DROP COLUMN `mother_job`,
    DROP COLUMN `mother_name`,
    DROP COLUMN `user_id`,
    ADD COLUMN `evaluationStatus` VARCHAR(191) NULL DEFAULT 'not_sent',
    ADD COLUMN `fatherIncome` INTEGER NULL,
    ADD COLUMN `fatherJob` VARCHAR(191) NULL,
    ADD COLUMN `fatherName` VARCHAR(191) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `motherIncome` INTEGER NULL,
    ADD COLUMN `motherJob` VARCHAR(191) NULL,
    ADD COLUMN `motherName` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achievement` ADD CONSTRAINT `Achievement_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

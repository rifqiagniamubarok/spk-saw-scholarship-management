/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Criteria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Criteria_name_key` ON `Criteria`(`name`);

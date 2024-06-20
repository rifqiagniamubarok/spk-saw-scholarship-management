-- AlterTable
ALTER TABLE `Student` ADD COLUMN `evaluationPoint` DOUBLE NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Evaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `criteriaId` INTEGER NOT NULL,
    `criteriaName` VARCHAR(191) NOT NULL,
    `criteriaMaxValue` DOUBLE NOT NULL,
    `criteriaWeightValue` INTEGER NOT NULL,
    `weightValue` INTEGER NULL,
    `value` DOUBLE NULL,
    `result` DOUBLE NULL,

    UNIQUE INDEX `Evaluation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_criteriaId_fkey` FOREIGN KEY (`criteriaId`) REFERENCES `Criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

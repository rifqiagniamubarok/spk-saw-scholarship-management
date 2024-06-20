-- CreateTable
CREATE TABLE `Criteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `weightValue` INTEGER NOT NULL,
    `maxValue` DOUBLE NOT NULL,

    UNIQUE INDEX `Criteria_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CriteriaOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criteriaId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,

    UNIQUE INDEX `CriteriaOption_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CriteriaOption` ADD CONSTRAINT `CriteriaOption_criteriaId_fkey` FOREIGN KEY (`criteriaId`) REFERENCES `Criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

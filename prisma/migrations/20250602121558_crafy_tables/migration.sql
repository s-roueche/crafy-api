-- CreateTable
CREATE TABLE `Company` (
    `SIRET` INTEGER NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,

    PRIMARY KEY (`SIRET`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `duration` DOUBLE NOT NULL DEFAULT 1,
    `craId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CRA` (
    `id` INTEGER NOT NULL,
    `serviceProviderId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `month` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_craId_fkey` FOREIGN KEY (`craId`) REFERENCES `CRA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CRA` ADD CONSTRAINT `CRA_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `Company`(`SIRET`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CRA` ADD CONSTRAINT `CRA_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Company`(`SIRET`) ON DELETE RESTRICT ON UPDATE CASCADE;

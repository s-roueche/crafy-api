/*
  Warnings:

  - The primary key for the `Activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `craId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Activity` table. All the data in the column will be lost.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SIRET` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CRA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reportId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeWorked` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Activity` DROP FOREIGN KEY `Activity_craId_fkey`;

-- DropForeignKey
ALTER TABLE `CRA` DROP FOREIGN KEY `CRA_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `CRA` DROP FOREIGN KEY `CRA_serviceProviderId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropIndex
DROP INDEX `Activity_craId_fkey` ON `Activity`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `Activity` DROP PRIMARY KEY,
    DROP COLUMN `craId`,
    DROP COLUMN `duration`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `reportId` VARCHAR(191) NOT NULL,
    ADD COLUMN `timeWorked` ENUM('FULL_DAY', 'HALF_DAY') NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Company` DROP PRIMARY KEY,
    DROP COLUMN `SIRET`,
    DROP COLUMN `address`,
    ADD PRIMARY KEY (`businessName`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `CRA`;

-- DropTable
DROP TABLE `Post`;

-- CreateTable
CREATE TABLE `Report` (
    `id` VARCHAR(191) NOT NULL,
    `serviceProviderId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `monthReport` DATETIME(3) NOT NULL,
    `comment` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `Company`(`businessName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Company`(`businessName`) ON DELETE RESTRICT ON UPDATE CASCADE;

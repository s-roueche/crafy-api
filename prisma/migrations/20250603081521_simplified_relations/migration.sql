/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceProviderId` on the `Report` table. All the data in the column will be lost.
  - The required column `id` was added to the `Company` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_serviceProviderId_fkey`;

-- DropIndex
DROP INDEX `Report_clientId_fkey` ON `Report`;

-- DropIndex
DROP INDEX `Report_serviceProviderId_fkey` ON `Report`;

-- AlterTable
ALTER TABLE `Activity` MODIFY `date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `Company` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `serviceProviderId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `monthReport` DATE NOT NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

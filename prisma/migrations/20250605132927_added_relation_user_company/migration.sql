/*
  Warnings:

  - Added the required column `userCreatorId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Company` ADD COLUMN `userCreatorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_userCreatorId_fkey` FOREIGN KEY (`userCreatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

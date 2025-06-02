/*
  Warnings:

  - You are about to alter the column `duration` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `Double` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Activity` MODIFY `duration` ENUM('FULL_DAY', 'HALF_DAY') NOT NULL DEFAULT 'FULL_DAY';

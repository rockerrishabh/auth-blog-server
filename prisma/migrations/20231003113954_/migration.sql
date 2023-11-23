/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `account` table. All the data in the column will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `refreshToken`;

-- DropTable
DROP TABLE `session`;

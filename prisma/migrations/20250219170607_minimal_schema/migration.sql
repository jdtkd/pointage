/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Pointage` table. All the data in the column will be lost.
  - The `status` column on the `Pointage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Exception` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Horaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Validation` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Pointage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PointageType" AS ENUM ('ARRIVEE', 'DEPART');

-- CreateEnum
CREATE TYPE "PointageStatus" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE');

-- DropForeignKey
ALTER TABLE "Horaire" DROP CONSTRAINT "Horaire_userId_fkey";

-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_pointageId_fkey";

-- DropIndex
DROP INDEX "Pointage_timestamp_idx";

-- DropIndex
DROP INDEX "Pointage_userId_idx";

-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "Pointage" DROP COLUMN "updatedAt",
DROP COLUMN "type",
ADD COLUMN     "type" "PointageType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PointageStatus" NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkId",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Exception";

-- DropTable
DROP TABLE "Horaire";

-- DropTable
DROP TABLE "Validation";

-- CreateIndex
CREATE INDEX "Pointage_userId_timestamp_idx" ON "Pointage"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "Pointage_type_timestamp_idx" ON "Pointage"("type", "timestamp");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

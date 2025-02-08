-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'RH', 'EMPLOYE');

-- CreateEnum
CREATE TYPE "PointageType" AS ENUM ('ARRIVEE', 'DEPART');

-- CreateEnum
CREATE TYPE "PointageStatus" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "departement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pointage" (
    "id" TEXT NOT NULL,
    "type" "PointageType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" JSONB,
    "commentaire" TEXT,
    "status" "PointageStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pointage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidePar" (
    "id" TEXT NOT NULL,
    "pointageId" TEXT NOT NULL,
    "valideurId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,
    "status" "PointageStatus" NOT NULL,

    CONSTRAINT "ValidePar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointageStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalHeures" DOUBLE PRECISION NOT NULL,
    "retards" INTEGER NOT NULL DEFAULT 0,
    "absences" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointageStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoraireTravail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jourSemaine" INTEGER NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HoraireTravail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Pointage_userId_timestamp_type_idx" ON "Pointage"("userId", "timestamp", "type");

-- CreateIndex
CREATE INDEX "Pointage_timestamp_idx" ON "Pointage"("timestamp");

-- CreateIndex
CREATE INDEX "Pointage_status_idx" ON "Pointage"("status");

-- CreateIndex
CREATE INDEX "Pointage_type_idx" ON "Pointage"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ValidePar_pointageId_key" ON "ValidePar"("pointageId");

-- CreateIndex
CREATE INDEX "ValidePar_valideurId_idx" ON "ValidePar"("valideurId");

-- CreateIndex
CREATE INDEX "ValidePar_timestamp_idx" ON "ValidePar"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_model_recordId_idx" ON "AuditLog"("model", "recordId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "PointageStats_date_idx" ON "PointageStats"("date");

-- CreateIndex
CREATE INDEX "PointageStats_userId_idx" ON "PointageStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PointageStats_userId_date_key" ON "PointageStats"("userId", "date");

-- CreateIndex
CREATE INDEX "HoraireTravail_userId_jourSemaine_idx" ON "HoraireTravail"("userId", "jourSemaine");

-- AddForeignKey
ALTER TABLE "Pointage" ADD CONSTRAINT "Pointage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidePar" ADD CONSTRAINT "ValidePar_pointageId_fkey" FOREIGN KEY ("pointageId") REFERENCES "Pointage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidePar" ADD CONSTRAINT "ValidePar_valideurId_fkey" FOREIGN KEY ("valideurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointageStats" ADD CONSTRAINT "PointageStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

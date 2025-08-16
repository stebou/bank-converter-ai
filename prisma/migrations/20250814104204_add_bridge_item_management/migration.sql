/*
  Warnings:

  - A unique constraint covering the columns `[bridge_payment_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bridge_item_id` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CompanyStatus" AS ENUM ('NEW', 'PROSPECT', 'IMPORTED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'NONPROFIT', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."bank_accounts" ADD COLUMN     "bridge_item_id" TEXT NOT NULL,
ADD COLUMN     "disconnected_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "bridge_payment_id" TEXT,
ADD COLUMN     "payment_url" TEXT,
ADD COLUMN     "plan_type" TEXT;

-- CreateTable
CREATE TABLE "public"."company_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3b82f6',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "company_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "siren" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "denomination" TEXT NOT NULL,
    "website" TEXT,
    "secteur" TEXT,
    "industrie" TEXT,
    "emplacement" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "adresseComplete" TEXT,
    "activitePrincipale" TEXT,
    "activitePrincipaleLibelle" TEXT,
    "categorieJuridique" TEXT,
    "trancheEffectifs" TEXT,
    "etatAdministratif" TEXT,
    "siege" BOOLEAN NOT NULL DEFAULT false,
    "dateCreation" TIMESTAMP(3),
    "statut" "public"."CompanyStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "linkedinUrl" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "contactPerson" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedFromINSEE" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "companyListId" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dirigeants" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nomUsage" TEXT,
    "pseudonyme" TEXT,
    "qualite" TEXT,
    "dateNaissance" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "dirigeants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6b7280',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyListId" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_tags" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "company_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_lists_userId_idx" ON "public"."company_lists"("userId");

-- CreateIndex
CREATE INDEX "company_lists_createdAt_idx" ON "public"."company_lists"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "companies_siren_key" ON "public"."companies"("siren");

-- CreateIndex
CREATE UNIQUE INDEX "companies_siret_key" ON "public"."companies"("siret");

-- CreateIndex
CREATE INDEX "companies_siren_idx" ON "public"."companies"("siren");

-- CreateIndex
CREATE INDEX "companies_siret_idx" ON "public"."companies"("siret");

-- CreateIndex
CREATE INDEX "companies_companyListId_idx" ON "public"."companies"("companyListId");

-- CreateIndex
CREATE INDEX "companies_ownerId_idx" ON "public"."companies"("ownerId");

-- CreateIndex
CREATE INDEX "companies_lastUpdatedFromINSEE_idx" ON "public"."companies"("lastUpdatedFromINSEE");

-- CreateIndex
CREATE INDEX "dirigeants_companyId_idx" ON "public"."dirigeants"("companyId");

-- CreateIndex
CREATE INDEX "tags_companyListId_idx" ON "public"."tags"("companyListId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_companyListId_key" ON "public"."tags"("name", "companyListId");

-- CreateIndex
CREATE UNIQUE INDEX "company_tags_companyId_tagId_key" ON "public"."company_tags"("companyId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bridge_payment_id_key" ON "public"."payments"("bridge_payment_id");

-- AddForeignKey
ALTER TABLE "public"."company_lists" ADD CONSTRAINT "company_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_companyListId_fkey" FOREIGN KEY ("companyListId") REFERENCES "public"."company_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dirigeants" ADD CONSTRAINT "dirigeants_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_companyListId_fkey" FOREIGN KEY ("companyListId") REFERENCES "public"."company_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_tags" ADD CONSTRAINT "company_tags_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_tags" ADD CONSTRAINT "company_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

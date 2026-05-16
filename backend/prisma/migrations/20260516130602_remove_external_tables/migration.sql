/*
  Warnings:

  - You are about to drop the `tm_auth_providers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tm_social_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tm_social_accounts" DROP CONSTRAINT "tm_social_accounts_providerId_fkey";

-- DropTable
DROP TABLE "tm_auth_providers";

-- DropTable
DROP TABLE "tm_social_accounts";

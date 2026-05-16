/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigneeId_fkey";

-- DropTable
DROP TABLE "tasks";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "tm_users" (
    "identity" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tm_users_pkey" PRIMARY KEY ("identity")
);

-- CreateTable
CREATE TABLE "tm_tasks" (
    "identity" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tm_tasks_pkey" PRIMARY KEY ("identity")
);

-- CreateTable
CREATE TABLE "tm_auth_providers" (
    "identity" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "providerName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tm_auth_providers_pkey" PRIMARY KEY ("identity")
);

-- CreateTable
CREATE TABLE "tm_social_accounts" (
    "identity" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "providerId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tm_social_accounts_pkey" PRIMARY KEY ("identity")
);

-- CreateIndex
CREATE UNIQUE INDEX "tm_users_id_key" ON "tm_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tm_users_email_key" ON "tm_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tm_tasks_id_key" ON "tm_tasks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tm_auth_providers_id_key" ON "tm_auth_providers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tm_social_accounts_id_key" ON "tm_social_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tm_social_accounts_externalId_key" ON "tm_social_accounts"("externalId");

-- AddForeignKey
ALTER TABLE "tm_tasks" ADD CONSTRAINT "tm_tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "tm_users"("identity") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tm_social_accounts" ADD CONSTRAINT "tm_social_accounts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "tm_auth_providers"("identity") ON DELETE RESTRICT ON UPDATE CASCADE;

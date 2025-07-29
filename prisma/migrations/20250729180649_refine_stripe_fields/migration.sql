/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_product_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_price_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_price_id` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_product_id` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plans" DROP COLUMN "stripePriceId",
DROP COLUMN "stripeProductId",
ADD COLUMN     "stripe_price_id" TEXT NOT NULL,
ADD COLUMN     "stripe_product_id" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "features" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "subscriptionStatus",
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT,
ADD COLUMN     "subscription_status" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_product_id_key" ON "plans"("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_price_id_key" ON "plans"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

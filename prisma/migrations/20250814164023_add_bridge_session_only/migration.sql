-- CreateTable
CREATE TABLE "public"."bridge_sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "connectUrl" TEXT NOT NULL,
    "itemId" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bridge_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bridge_sessions_sessionId_key" ON "public"."bridge_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "bridge_sessions_userId_idx" ON "public"."bridge_sessions"("userId");

-- CreateIndex
CREATE INDEX "bridge_sessions_status_idx" ON "public"."bridge_sessions"("status");

-- AddForeignKey
ALTER TABLE "public"."bridge_sessions" ADD CONSTRAINT "bridge_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

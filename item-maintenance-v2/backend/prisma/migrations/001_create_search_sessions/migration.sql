-- CreateTable
CREATE TABLE "search_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "searchQuery" TEXT,
    "filters" JSONB,
    "sortConfig" JSONB,
    "columnConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_sessions_userId_idx" ON "search_sessions"("userId");

-- CreateIndex
CREATE INDEX "search_sessions_createdAt_idx" ON "search_sessions"("createdAt");


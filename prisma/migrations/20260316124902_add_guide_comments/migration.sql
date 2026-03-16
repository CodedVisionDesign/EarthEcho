-- AlterTable
ALTER TABLE "users" ADD COLUMN "customImage" TEXT;

-- CreateTable
CREATE TABLE "guide_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "guide_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "guide_comments_guideSlug_createdAt_idx" ON "guide_comments"("guideSlug", "createdAt");

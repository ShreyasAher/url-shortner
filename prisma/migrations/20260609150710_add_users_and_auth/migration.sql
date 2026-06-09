/*
  Warnings:

  - Added the required column `userId` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "longUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_links" ("clicks", "createdAt", "id", "longUrl", "shortCode") SELECT "clicks", "createdAt", "id", "longUrl", "shortCode" FROM "links";
DROP TABLE "links";
ALTER TABLE "new_links" RENAME TO "links";
CREATE UNIQUE INDEX "links_shortCode_key" ON "links"("shortCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

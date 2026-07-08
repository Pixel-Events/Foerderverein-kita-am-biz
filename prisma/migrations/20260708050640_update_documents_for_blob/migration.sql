/*
  Warnings:

  - You are about to drop the column `data` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `isVisibleForMembers` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Document` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "data",
DROP COLUMN "fileName",
DROP COLUMN "isVisibleForMembers",
DROP COLUMN "mimeType",
DROP COLUMN "size",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

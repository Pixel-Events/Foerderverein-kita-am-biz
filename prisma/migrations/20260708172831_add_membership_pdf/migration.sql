-- AlterTable
ALTER TABLE "MembershipApplication" ADD COLUMN     "pdfData" BYTEA,
ADD COLUMN     "pdfFileName" TEXT,
ADD COLUMN     "pdfMimeType" TEXT;

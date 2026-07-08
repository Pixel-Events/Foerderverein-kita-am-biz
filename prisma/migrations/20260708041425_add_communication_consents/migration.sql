-- AlterTable
ALTER TABLE "MembershipApplication" ADD COLUMN     "emailInfoConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newsletterConsent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MembershipApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "street" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "membershipFee" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "iban" TEXT,
    "accountHolder" TEXT,
    "message" TEXT
);

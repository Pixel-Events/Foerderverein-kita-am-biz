/*
  Warnings:

  - You are about to drop the column `answerOneDe` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `answerTwoDe` on the `SurveyResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SurveyResponse" DROP COLUMN "answerOneDe",
DROP COLUMN "answerTwoDe";

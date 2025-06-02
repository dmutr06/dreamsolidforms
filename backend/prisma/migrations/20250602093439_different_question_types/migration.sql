/*
  Warnings:

  - You are about to drop the column `config` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN "checkboxValue" JSONB;
ALTER TABLE "Answer" ADD COLUMN "choiceValue" INTEGER;
ALTER TABLE "Answer" ADD COLUMN "numberValue" TEXT;
ALTER TABLE "Answer" ADD COLUMN "textValue" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT,
    "number" INTEGER,
    "choices" JSONB,
    CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("formId", "id", "label", "order", "required", "type") SELECT "formId", "id", "label", "order", "required", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

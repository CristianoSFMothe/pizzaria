-- Add column
ALTER TABLE "categories" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

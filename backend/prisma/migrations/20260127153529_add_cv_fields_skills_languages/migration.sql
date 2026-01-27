-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "isVisibleInPdf" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showDescriptionInPdf" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "isVisibleInPdf" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showDescriptionInPdf" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isVisibleInPdf" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "level" TEXT NOT NULL,
    "level_en" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

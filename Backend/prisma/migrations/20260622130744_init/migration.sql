-- CreateTable
CREATE TABLE "analysis" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "aiScore" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_pkey" PRIMARY KEY ("id")
);

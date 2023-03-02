-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "middleName" VARCHAR(255),
    "lastName" VARCHAR(255) NOT NULL,
    "nickName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_nickName_key" ON "user"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

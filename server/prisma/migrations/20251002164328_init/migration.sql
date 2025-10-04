-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structure" JSONB NOT NULL DEFAULT '{}',
    "createdBy" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponses" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "response_data" JSONB NOT NULL DEFAULT '{}',
    "q_structure" JSONB NOT NULL DEFAULT '{}',
    "createdBy" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSharing" (
    "id" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "sharedWithUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSharing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FormTemplates" ADD CONSTRAINT "FormTemplates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "FormTemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSharing" ADD CONSTRAINT "FormSharing_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "FormTemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSharing" ADD CONSTRAINT "FormSharing_sharedWithUserId_fkey" FOREIGN KEY ("sharedWithUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

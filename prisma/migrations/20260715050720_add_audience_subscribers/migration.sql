-- CreateTable
CREATE TABLE "AudienceSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "emailConsent" BOOLEAN NOT NULL DEFAULT false,
    "smsConsent" BOOLEAN NOT NULL DEFAULT false,
    "consentText" TEXT,
    "consentSource" TEXT NOT NULL DEFAULT 'entry-gate',
    "userAgent" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudienceSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AudienceSubscriber_joinedAt_idx" ON "AudienceSubscriber"("joinedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AudienceSubscriber_email_key" ON "AudienceSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AudienceSubscriber_phone_key" ON "AudienceSubscriber"("phone");

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paypalOrderId" TEXT NOT NULL,
    "paypalPayerId" TEXT,
    "paypalPaymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaApplication" (
    "id" TEXT NOT NULL,
    "nationalityCode" TEXT NOT NULL,
    "nationalityName" TEXT NOT NULL,
    "nationalityFlag" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "destinationFlag" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "visaValidity" TEXT,
    "governmentFee" DOUBLE PRECISION NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "countryOfBirthCode" TEXT NOT NULL,
    "countryOfBirthName" TEXT NOT NULL,
    "countryOfBirthFlag" TEXT NOT NULL,
    "passportNationality" TEXT,
    "passportNumber" TEXT NOT NULL,
    "passportIssueDate" TEXT NOT NULL,
    "passportExpiryDate" TEXT NOT NULL,
    "residenceCountryCode" TEXT NOT NULL,
    "residenceCountryName" TEXT NOT NULL,
    "residenceCountryFlag" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "ownsAssets" TEXT NOT NULL,
    "travelHistory" TEXT NOT NULL,
    "previousVisaApp" TEXT NOT NULL,
    "passportImageUrl" TEXT,
    "passportImagePublicId" TEXT,
    "travelers" JSONB NOT NULL,
    "paymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "VisaApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paypalOrderId_key" ON "Payment"("paypalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "VisaApplication_paymentId_key" ON "VisaApplication"("paymentId");

-- AddForeignKey
ALTER TABLE "VisaApplication" ADD CONSTRAINT "VisaApplication_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

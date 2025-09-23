-- CreateTable
CREATE TABLE "SensorDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "boundLotId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SensorDevice_boundLotId_fkey" FOREIGN KEY ("boundLotId") REFERENCES "Lot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorDevice_apiKeyHash_key" ON "SensorDevice"("apiKeyHash");

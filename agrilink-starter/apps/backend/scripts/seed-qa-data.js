const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedQAData() {
  try {
    // Create some sample QA inspections
    const inspections = [
      {
        farmId: 'farm-1',
        lotId: 'lot-1',
        defectRate: 1.5,
        sizeGrade: 4.2,
        brix: 19.5,
        tempExcursions: 0,
        inspectedAt: new Date('2024-09-20'),
      },
      {
        farmId: 'farm-1',
        lotId: 'lot-2',
        defectRate: 2.3,
        sizeGrade: 3.8,
        brix: 18.2,
        tempExcursions: 1,
        inspectedAt: new Date('2024-09-21'),
      },
      {
        farmId: 'farm-2',
        lotId: 'lot-3',
        defectRate: 1.1,
        sizeGrade: 4.5,
        brix: 20.1,
        tempExcursions: 0,
        inspectedAt: new Date('2024-09-22'),
      },
      {
        farmId: 'farm-2',
        lotId: 'lot-4',
        defectRate: 3.2,
        sizeGrade: 3.2,
        brix: 17.8,
        tempExcursions: 2,
        inspectedAt: new Date('2024-09-23'),
      },
    ]

    for (const inspection of inspections) {
      await prisma.qaInspection.create({
        data: inspection
      })
    }

    // Create some sample certificates
    const certificates = [
      {
        farmId: 'farm-1',
        lotId: 'lot-1',
        type: 'ORGANIC',
        issuedAt: new Date('2024-09-01'),
        expiresAt: new Date('2025-09-01'),
      },
      {
        farmId: 'farm-1',
        lotId: 'lot-2',
        type: 'GLOBAL_GAP',
        issuedAt: new Date('2024-08-15'),
        expiresAt: new Date('2025-08-15'),
      },
      {
        farmId: 'farm-2',
        lotId: 'lot-3',
        type: 'QUALITY_ASSURANCE',
        issuedAt: new Date('2024-09-10'),
        expiresAt: new Date('2025-09-10'),
      },
    ]

    for (const certificate of certificates) {
      await prisma.certificate.create({
        data: certificate
      })
    }

    console.log('QA test data seeded successfully!')
  } catch (error) {
    console.error('Error seeding QA data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedQAData()
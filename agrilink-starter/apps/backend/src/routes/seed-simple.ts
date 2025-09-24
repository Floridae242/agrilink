import { Request, Response } from 'express'

// Mock seed data endpoint
export const seedQAData = async (req: Request, res: Response) => {
  try {
    // In production, this would seed the database with sample data
    // For now, we'll just return a success message
    
    const mockSeedData = {
      users: [
        { id: 'user-1', email: 'inspector1@agrilink.com', name: 'Inspector John', role: 'INSPECTOR' },
        { id: 'user-2', email: 'inspector2@agrilink.com', name: 'Inspector Jane', role: 'INSPECTOR' },
        { id: 'user-3', email: 'farmer@agrilink.local', name: 'Farmer Smith', role: 'FARMER' },
        { id: 'user-4', email: 'buyer@agrilink.local', name: 'Buyer Corp', role: 'BUYER' },
      ],
      farms: [
        { id: 'farm-1', name: 'Green Valley Farm', district: 'Lopburi', ownerId: 'user-3' },
        { id: 'farm-2', name: 'Sunrise Agriculture', district: 'Nakhon Pathom', ownerId: 'user-3' },
      ],
      lots: [
        { id: 'lot-1', publicId: 'RICE001', farmId: 'farm-1', produce: 'Jasmine Rice' },
        { id: 'lot-2', publicId: 'RICE002', farmId: 'farm-2', produce: 'Brown Rice' },
      ],
      inspections: [
        {
          id: 'inspection-1',
          lotId: 'lot-1',
          inspectorId: 'user-1',
          defects: 2,
          grade: 'A',
          notes: 'High quality jasmine rice with minimal defects',
        },
        {
          id: 'inspection-2',
          lotId: 'lot-2',
          inspectorId: 'user-2',
          defects: 5,
          grade: 'B',
          notes: 'Good quality brown rice with minor defects',
        }
      ],
      certificates: [
        {
          id: 'cert-1',
          farmId: 'farm-1',
          lotId: 'lot-1',
          type: 'GAP',
          issuer: 'Department of Agriculture',
          fileUrl: '/uploads/certificates/gap-cert-001.pdf',
        },
        {
          id: 'cert-2',
          farmId: 'farm-2',
          type: 'ORGANIC',
          issuer: 'Organic Certification Board',
          fileUrl: '/uploads/certificates/organic-cert-002.pdf',
        }
      ]
    };

    res.json({
      success: true,
      message: 'Mock seed data created successfully',
      data: {
        usersCreated: mockSeedData.users.length,
        farmsCreated: mockSeedData.farms.length,
        lotsCreated: mockSeedData.lots.length,
        inspectionsCreated: mockSeedData.inspections.length,
        certificatesCreated: mockSeedData.certificates.length,
      }
    });

  } catch (error) {
    console.error('Error in seed operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed QA data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default { seedQAData };
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const qaKpiSchema = z.object({
  lotPublicId: z.string().optional(),
  farmId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  tempThreshold: z.coerce.number().default(8),
}).refine((data) => data.lotPublicId || data.farmId, {
  message: "Either lotPublicId or farmId must be provided"
});

const inspectionSchema = z.object({
  lotId: z.string(),
  defects: z.coerce.number().min(0),
  grade: z.enum(['A', 'B', 'C', 'REJECT']),
  notes: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Mock data for development
const mockInspections: Array<{
  id: string;
  lotId: string;
  inspectorId: string;
  defects: number;
  grade: string;
  notes?: string;
  images: string[];
  createdAt: Date;
}> = [
  {
    id: '1',
    lotId: 'lot1',
    inspectorId: 'inspector1',
    defects: 2,
    grade: 'A',
    notes: 'Good quality rice',
    images: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    lotId: 'lot2',
    inspectorId: 'inspector1',
    defects: 5,
    grade: 'B',
    notes: 'Minor defects found',
    images: [],
    createdAt: new Date(),
  }
];

const mockCertificates: Array<{
  id: string;
  farmId: string;
  lotId?: string;
  type: string;
  issuer: string;
  fileUrl: string;
  issuedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
}> = [
  {
    id: '1',
    farmId: 'farm1',
    lotId: 'lot1',
    type: 'GAP',
    issuer: 'Agricultural Department',
    fileUrl: '/uploads/certificates/cert1.pdf',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    createdAt: new Date(),
  }
];

// GET /api/qa/kpis - Get QA KPIs with filters
router.get('/kpis', requireAuth, async (req: Request, res: Response) => {
  try {
    const query = qaKpiSchema.parse(req.query);
    
    // Mock KPI calculations
    const mockData = {
      qualityScore: 92.5,
      totalInspections: mockInspections.length,
      passRate: 95.2,
      avgDefects: 2.5,
      gradeDistribution: {
        A: 60,
        B: 30,
        C: 8,
        REJECT: 2
      },
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toISOString(),
        qualityScore: 85 + Math.random() * 15,
        inspections: Math.floor(Math.random() * 50) + 10,
        defects: Math.floor(Math.random() * 10) + 1
      })),
      temperatureAlerts: [
        {
          lotId: 'lot1',
          timestamp: new Date().toISOString(),
          temperature: 12.5,
          threshold: query.tempThreshold,
          severity: 'WARNING'
        }
      ]
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Error fetching QA KPIs:', error);
    res.status(400).json({
      success: false,
      message: error instanceof z.ZodError ? error.errors[0]?.message : 'Invalid request parameters'
    });
  }
});

// POST /api/qa/inspections - Create new QA inspection
router.post('/inspections', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = inspectionSchema.parse(req.body);
    
    // Mock inspection creation
    const newInspection = {
      id: `inspection_${Date.now()}`,
      ...validatedData,
      images: validatedData.images || [],
      inspectorId: (req as any).user?.id || 'inspector1',
      createdAt: new Date(),
    };

    mockInspections.push(newInspection);

    res.status(201).json({
      success: true,
      data: newInspection
    });
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(400).json({
      success: false,
      message: error instanceof z.ZodError ? error.errors[0]?.message : 'Failed to create inspection'
    });
  }
});

// GET /api/qa/certificates - Get certificates for farm/lot
router.get('/certificates', requireAuth, async (req: Request, res: Response) => {
  try {
    const { farmId, lotId } = req.query;

    let filteredCertificates = mockCertificates;
    
    if (farmId) {
      filteredCertificates = filteredCertificates.filter(cert => cert.farmId === farmId);
    }
    
    if (lotId) {
      filteredCertificates = filteredCertificates.filter(cert => cert.lotId === lotId);
    }

    res.json({
      success: true,
      data: filteredCertificates.map(cert => ({
        id: cert.id,
        type: cert.type,
        issuer: cert.issuer,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        fileUrl: cert.fileUrl,
      }))
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// POST /api/qa/certificates/upload - Upload certificate
router.post('/certificates/upload', requireAuth, async (req: Request, res: Response) => {
  try {
    const { farmId, lotId, type, issuer, issuedAt, expiresAt } = req.body;

    // Mock file upload (in production, this would handle actual file upload)
    const mockCertificate = {
      id: `cert_${Date.now()}`,
      farmId,
      lotId,
      type,
      issuer,
      fileUrl: `/uploads/certificates/mock_${Date.now()}.pdf`,
      issuedAt: new Date(issuedAt),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdAt: new Date(),
    };

    mockCertificates.push(mockCertificate);

    res.status(201).json({
      success: true,
      data: mockCertificate
    });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload certificate'
    });
  }
});

// GET /api/qa/inspections - Get QA inspections
router.get('/inspections', requireAuth, async (req: Request, res: Response) => {
  try {
    const { lotId, farmId } = req.query;

    let filteredInspections = mockInspections;
    
    if (lotId) {
      filteredInspections = filteredInspections.filter(inspection => inspection.lotId === lotId);
    }

    res.json({
      success: true,
      data: filteredInspections
    });
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inspections'
    });
  }
});

export default router;
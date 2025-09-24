import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireRole, Role } from '../middleware/auth.js';

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
  lotId: z.string().optional(),
  lotPublicId: z.string().optional(),
  defects: z.number().min(0),
  grade: z.enum(['A', 'B', 'C', 'REJECT']),
  notes: z.string().optional(),
  images: z.array(z.string()).optional(),
}).refine((data) => data.lotId || data.lotPublicId, {
  message: "Either lotId or lotPublicId must be provided"
});

const certificateSchema = z.object({
  farmId: z.string().optional(),
  lotId: z.string().optional(),
  lotPublicId: z.string().optional(),
  type: z.string(),
  issuer: z.string(),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
}).refine((data) => data.farmId || data.lotId || data.lotPublicId, {
  message: "Either farmId, lotId, or lotPublicId must be provided"
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'certificates');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

export function createQaRoutes(prisma: PrismaClient) {
  const router = Router();

  /**
   * GET /api/qa/kpi
   * Get QA KPIs and analytics
   */
  router.get('/kpi', requireAuth(prisma), async (req, res) => {
    try {
      const params = qaKpiSchema.parse(req.query);
      
      // Determine date range
      const fromDate = params.from ? new Date(params.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const toDate = params.to ? new Date(params.to) : new Date();

      // Find target lots
      let lots;
      if (params.lotPublicId) {
        const lot = await prisma.lot.findUnique({
          where: { publicId: params.lotPublicId },
          include: { farm: true }
        });
        lots = lot ? [lot] : [];
      } else if (params.farmId) {
        lots = await prisma.lot.findMany({
          where: { farmId: params.farmId },
          include: { farm: true }
        });
      }

      if (!lots || lots.length === 0) {
        return res.status(404).json({ error: 'No lots found' });
      }

      const lotIds = lots.map(lot => lot.id);

      // Get QA inspections
      const inspections = await prisma.qaInspection.findMany({
        where: {
          lotId: { in: lotIds },
          createdAt: {
            gte: fromDate,
            lte: toDate
          }
        },
        include: {
          lot: true,
          inspector: true
        }
      });

      // Get temperature events
      const tempEvents = await prisma.event.findMany({
        where: {
          lotId: { in: lotIds },
          temp: { not: null },
          at: {
            gte: fromDate,
            lte: toDate
          }
        },
        orderBy: { at: 'asc' }
      });

      // Calculate KPIs
      const totalInspections = inspections.length;
      const totalDefects = inspections.reduce((sum, inspection) => sum + inspection.defects, 0);
      const defectRate = totalInspections > 0 ? (totalDefects / totalInspections) : 0;
      
      const validTemps = tempEvents.filter(e => e.temp !== null);
      const avgTemp = validTemps.length > 0 
        ? validTemps.reduce((sum, e) => sum + e.temp!, 0) / validTemps.length 
        : 0;
      
      const tempExcursions = validTemps.filter(e => e.temp! > params.tempThreshold).length;

      // Generate daily series data
      const dailyData = new Map();
      
      // Group temperature data by day
      tempEvents.forEach(event => {
        if (event.temp !== null) {
          const day = event.at.toISOString().split('T')[0];
          if (!dailyData.has(day)) {
            dailyData.set(day, { date: day, temps: [], defects: 0 });
          }
          dailyData.get(day).temps.push(event.temp);
        }
      });

      // Group defects by day
      inspections.forEach(inspection => {
        const day = inspection.createdAt.toISOString().split('T')[0];
        if (!dailyData.has(day)) {
          dailyData.set(day, { date: day, temps: [], defects: 0 });
        }
        dailyData.get(day).defects += inspection.defects;
      });

      // Convert to array and calculate averages
      const series = Array.from(dailyData.values())
        .map(data => ({
          date: data.date,
          avgTemp: data.temps.length > 0 
            ? data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length 
            : null,
          defects: data.defects
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      res.json({
        kpis: {
          totalInspections,
          totalDefects,
          defectRate: Math.round(defectRate * 100) / 100,
          avgTemp: Math.round(avgTemp * 100) / 100,
          tempExcursions,
          tempThreshold: params.tempThreshold
        },
        series,
        period: {
          from: fromDate.toISOString(),
          to: toDate.toISOString()
        },
        lots: lots.map(lot => ({
          id: lot.id,
          publicId: lot.publicId,
          produce: lot.produce,
          farmName: lot.farm.name
        }))
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('QA KPI error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/qa/inspections
   * Create QA inspection
   */
  router.post('/inspections', requireAuth(prisma), requireRole([Role.INSPECTOR, Role.ADMIN]), async (req, res) => {
    try {
      const data = inspectionSchema.parse(req.body);
      
      // Find the lot
      let lot;
      if (data.lotId) {
        lot = await prisma.lot.findUnique({ where: { id: data.lotId } });
      } else if (data.lotPublicId) {
        lot = await prisma.lot.findUnique({ where: { publicId: data.lotPublicId } });
      }

      if (!lot) {
        return res.status(404).json({ error: 'Lot not found' });
      }

      const inspection = await prisma.qaInspection.create({
        data: {
          lotId: lot.id,
          inspectorId: req.user!.id,
          defects: data.defects,
          grade: data.grade,
          notes: data.notes || null,
          images: data.images ? JSON.stringify(data.images) : null,
        },
        include: {
          lot: {
            include: { farm: true }
          },
          inspector: true
        }
      });

      res.status(201).json({
        id: inspection.id,
        lotId: inspection.lotId,
        lotPublicId: inspection.lot.publicId,
        defects: inspection.defects,
        grade: inspection.grade,
        notes: inspection.notes,
        inspector: {
          id: inspection.inspector.id,
          name: inspection.inspector.name
        },
        createdAt: inspection.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('QA inspection error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/qa/certificates
   * Get certificates
   */
  router.get('/certificates', async (req, res) => {
    try {
      const { lotPublicId, farmId } = req.query;
      
      let whereClause: any = {};
      
      if (lotPublicId) {
        const lot = await prisma.lot.findUnique({
          where: { publicId: lotPublicId as string }
        });
        if (!lot) {
          return res.status(404).json({ error: 'Lot not found' });
        }
        whereClause.lotId = lot.id;
      } else if (farmId) {
        whereClause.farmId = farmId as string;
      }

      const certificates = await prisma.certificate.findMany({
        where: whereClause,
        include: {
          farm: true,
          lot: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(certificates.map(cert => ({
        id: cert.id,
        type: cert.type,
        issuer: cert.issuer,
        fileUrl: cert.fileUrl,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        farm: {
          id: cert.farm.id,
          name: cert.farm.name
        },
        lot: cert.lot ? {
          id: cert.lot.id,
          publicId: cert.lot.publicId,
          produce: cert.lot.produce
        } : null,
        createdAt: cert.createdAt
      })));

    } catch (error) {
      console.error('Get certificates error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/qa/certificates
   * Upload certificate
   */
  router.post('/certificates', requireAuth(prisma), requireRole([Role.FARMER, Role.INSPECTOR, Role.ADMIN]), upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const data = certificateSchema.parse(req.body);
      
      // Determine farmId and lotId
      let farmId = data.farmId;
      let lotId = data.lotId;

      if (data.lotPublicId) {
        const lot = await prisma.lot.findUnique({
          where: { publicId: data.lotPublicId },
          include: { farm: true }
        });
        if (!lot) {
          return res.status(404).json({ error: 'Lot not found' });
        }
        lotId = lot.id;
        farmId = lot.farmId;
      }

      if (!farmId) {
        return res.status(400).json({ error: 'Farm ID must be provided or derivable from lot' });
      }

      // Create certificate record
      const fileUrl = `/uploads/certificates/${req.file.filename}`;
      
      const certificate = await prisma.certificate.create({
        data: {
          farmId,
          lotId: lotId || null,
          type: data.type,
          issuer: data.issuer,
          fileUrl,
          issuedAt: new Date(data.issuedAt),
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        },
        include: {
          farm: true,
          lot: true
        }
      });

      res.status(201).json({
        id: certificate.id,
        type: certificate.type,
        issuer: certificate.issuer,
        fileUrl: certificate.fileUrl,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        farm: {
          id: certificate.farm.id,
          name: certificate.farm.name
        },
        lot: certificate.lot ? {
          id: certificate.lot.id,
          publicId: certificate.lot.publicId,
          produce: certificate.lot.produce
        } : null,
        createdAt: certificate.createdAt
      });

    } catch (error) {
      // Clean up uploaded file if database operation fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete uploaded file:', err);
        });
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Certificate upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import { z } from 'zod';
import { createHash } from 'crypto';

const IOT_MASTER_KEY = process.env.IOT_MASTER_KEY || 'MASTER_IOT_KEY_CHANGE_IN_PRODUCTION';

// Validation schema for IoT ingest
const iotIngestSchema = z.object({
  lotId: z.string().optional(),
  lotPublicId: z.string().optional(),
  temp: z.number().min(-50).max(100),
  hum: z.number().min(0).max(100).optional(),
  location: z.string().optional(),
  at: z.string().datetime().optional(),
}).refine((data) => data.lotId || data.lotPublicId, {
  message: "Either lotId or lotPublicId must be provided"
});

/**
 * Generate SHA256 hash of API key
 */
function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

export function createIotRoutes(prisma: PrismaClient, io: Server) {
  const router = Router();

  /**
   * POST /api/iot/ingest
   * Ingest sensor data from IoT devices
   */
  router.post('/ingest', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required in x-api-key header' });
      }

      let deviceName = 'Unknown Device';
      let isAuthorized = false;

      // Check master key first
      if (apiKey === IOT_MASTER_KEY) {
        isAuthorized = true;
        deviceName = 'Master Device';
      } else {
        // Check device-specific API key
        const apiKeyHash = hashApiKey(apiKey);
        const device = await prisma.sensorDevice.findUnique({
          where: { apiKeyHash }
        });

        if (device) {
          isAuthorized = true;
          deviceName = device.name;
        }
      }

      if (!isAuthorized) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      // Validate request body
      const data = iotIngestSchema.parse(req.body);

      // Find the lot
      let lot;
      if (data.lotId) {
        lot = await prisma.lot.findUnique({
          where: { id: data.lotId },
          include: { farm: true }
        });
      } else if (data.lotPublicId) {
        lot = await prisma.lot.findUnique({
          where: { publicId: data.lotPublicId },
          include: { farm: true }
        });
      }

      if (!lot) {
        return res.status(404).json({ error: 'Lot not found' });
      }

      // Create event
      const eventDate = data.at ? new Date(data.at) : new Date();
      const event = await prisma.event.create({
        data: {
          lotId: lot.id,
          type: 'SENSOR',
          note: `Sensor reading from ${deviceName}`,
          temp: data.temp,
          hum: data.hum || null,
          at: eventDate,
          place: data.location || 'IoT Device'
        }
      });

      // Broadcast real-time update
      const updateData = {
        lotId: lot.id,
        lotPublicId: lot.publicId,
        farmName: lot.farm.name,
        produce: lot.produce,
        event: {
          id: event.id,
          type: event.type,
          temp: event.temp,
          hum: event.hum,
          at: event.at,
          place: event.place,
          note: event.note
        },
        deviceName,
        timestamp: new Date().toISOString()
      };

      io.of('/realtime').emit('sensor:update', updateData);

      res.json({
        success: true,
        event: {
          id: event.id,
          lotId: lot.id,
          lotPublicId: lot.publicId,
          temp: event.temp,
          hum: event.hum,
          at: event.at
        },
        message: `Data received from ${deviceName}`
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      }
      
      console.error('IoT ingest error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/iot/devices
   * List sensor devices (admin only)
   */
  router.get('/devices', async (req, res) => {
    try {
      // Note: Add auth middleware when implementing admin panel
      const devices = await prisma.sensorDevice.findMany({
        include: {
          boundLot: {
            include: {
              farm: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(devices.map(device => ({
        id: device.id,
        name: device.name,
        boundLot: device.boundLot ? {
          id: device.boundLot.id,
          publicId: device.boundLot.publicId,
          produce: device.boundLot.produce,
          farmName: device.boundLot.farm.name
        } : null,
        createdAt: device.createdAt,
        // Don't expose API key hash for security
      })));
    } catch (error) {
      console.error('Get devices error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
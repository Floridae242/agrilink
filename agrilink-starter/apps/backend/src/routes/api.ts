import { Router } from 'express'
import type { PrismaClient } from '@prisma/client'
import type { Server } from 'socket.io'
import { createAuthRoutes } from './auth.js'
import { createIotRoutes } from './iot.js'
import { createQaRoutes } from './qa.js'
import { requireAuth, requireRole, Role } from '../middleware/auth.js'

export default function api(prisma: PrismaClient, io: Server){
  const r = Router()

  // Auth routes (public)
  r.use('/auth', createAuthRoutes(prisma))

  // IoT routes (API key protected)
  r.use('/iot', createIotRoutes(prisma, io))

  // QA routes (auth protected)
  r.use('/qa', createQaRoutes(prisma))

  // pilot form (public)
  r.post('/pilot', async (req, res)=>{
    console.log('pilot form', req.body)
    res.json({ ok: true })
  })

  // public QR lot
  r.get('/public/lot/:publicId', async (req, res)=>{
    const lot = await prisma.lot.findUnique({ where: { publicId: req.params.publicId }, include: { farm:true, events:true } })
    if(!lot) return res.status(404).json({ error:'Not found' })
    res.json(lot)
  })

  // farms (requires auth)
  r.get('/farms', requireAuth(prisma), async (_req, res)=>{
    const farms = await prisma.farm.findMany({ take: 50 })
    res.json(farms)
  })

  // lots (requires FARMER or ADMIN role)
  r.post('/lots', requireAuth(prisma), requireRole([Role.FARMER, Role.ADMIN]), async (req, res)=>{
    const { farmId, produce } = req.body
    const lot = await prisma.lot.create({ data: { farmId, produce, publicId: 'LOT-'+Math.random().toString(36).slice(2,8) } })
    res.json(lot)
  })

  r.get('/lots/:id/events', requireAuth(prisma), async (req, res)=>{
    const events = await prisma.event.findMany({ where: { lotId: req.params.id }, orderBy: { at: 'asc' } })
    res.json(events)
  })

  r.post('/lots/:id/events', requireAuth(prisma), requireRole([Role.FARMER, Role.INSPECTOR, Role.ADMIN]), async (req, res)=>{
    const e = await prisma.event.create({ data: { lotId: req.params.id, ...req.body } })
    // broadcast realtime
    io.of('/realtime').emit('sensor:update', { lotId: req.params.id, ...req.body })
    res.json(e)
  })

  return r
}

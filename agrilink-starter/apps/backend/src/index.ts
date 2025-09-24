import 'dotenv/config'
import express from 'express'
import http from 'http'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import api from './routes/api.js'

// Simple CORS middleware instead of the cors package
const corsMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })
const prisma = new PrismaClient()

// Middlewares
app.use(helmet())
app.use(corsMiddleware)
app.use(express.json())
app.use(morgan('dev'))

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true }))

// API routes
app.use('/api', api(prisma, io))

const PORT = Number(process.env.PORT || 8080)
server.listen(PORT, () => {
  console.log('AgriLink backend running on :'+PORT)
})

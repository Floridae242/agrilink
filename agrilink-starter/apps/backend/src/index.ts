import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import api from './routes/api.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })
const prisma = new PrismaClient()

// Middlewares
app.use(helmet())
app.use(cors())
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

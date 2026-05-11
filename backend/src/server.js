import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes    from './routes/auth.js'
import orderRoutes   from './routes/orders.js'
import contactRoutes from './routes/contact.js'
import adminRoutes   from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api/orders',  orderRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin',   adminRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// ── Connect DB + Start ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected — crispyhub database ready')
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

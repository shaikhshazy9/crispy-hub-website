import express from 'express'
import Order from '../models/Order.js'
import { protect, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// POST /api/orders  — place a new order (works for guests too)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, customerName, customerEmail, note } = req.body

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order.' })
    if (!customerName)
      return res.status(400).json({ message: 'Customer name is required.' })

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const vat      = parseFloat((subtotal * 0.05).toFixed(2))
    const total    = parseFloat((subtotal + vat).toFixed(2))

    const order = await Order.create({
      user:          req.user?._id || null,
      customerName,
      customerEmail: customerEmail || req.user?.email || '',
      items,
      subtotal,
      vat,
      total,
      note: note || '',
    })

    res.status(201).json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/my  — get logged-in user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

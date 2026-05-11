import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Message from '../models/Message.js'
import { adminProtect } from '../middleware/adminAuth.js'

const router = express.Router()

const signAdminToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, { expiresIn: '7d' })

// ── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' })

    const admin = await Admin.findOne({ email })
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials.' })

    const token = signAdminToken(admin._id)
    res.json({ token, admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── Dashboard Stats ───────────────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalMessages, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Message.countDocuments(),
      Order.find().select('total status createdAt'),
    ])

    const totalRevenue    = orders.reduce((s, o) => s + o.total, 0)
    const unreadMessages  = await Message.countDocuments({ read: false })
    const pendingOrders   = await Order.countDocuments({ status: { $in: ['Confirmed', 'Preparing'] } })
    const deliveredToday  = await Order.countDocuments({
      status: 'Delivered',
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) },
    })

    // Last 7 days order counts
    const week = []
    for (let i = 6; i >= 0; i--) {
      const start = new Date(); start.setDate(start.getDate() - i); start.setHours(0,0,0,0)
      const end   = new Date(); end.setDate(end.getDate()   - i); end.setHours(23,59,59,999)
      const count = await Order.countDocuments({ createdAt: { $gte: start, $lte: end } })
      week.push({ date: start.toLocaleDateString('en-US', { weekday: 'short' }), orders: count })
    }

    res.json({ totalRevenue, totalOrders, totalUsers, totalMessages, unreadMessages, pendingOrders, deliveredToday, week })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── Orders ────────────────────────────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', adminProtect, async (req, res) => {
  try {
    const { status, search } = req.query
    const filter = {}
    if (status && status !== 'All') filter.status = status
    if (search) filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
    ]
    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('user', 'name email')
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', adminProtect, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['Confirmed', 'Preparing', 'Delivered', 'Cancelled']
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status.' })

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── Users ─────────────────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    const usersWithStats = await Promise.all(users.map(async u => {
      const orders = await Order.find({ user: u._id })
      return {
        ...u.toObject(),
        orderCount: orders.length,
        totalSpent: orders.reduce((s, o) => s + o.total, 0),
      }
    }))
    res.json({ users: usersWithStats })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/admin/users/:id/block
router.patch('/users/:id/block', adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    user.isBlocked = !user.isBlocked
    await user.save()
    res.json({ user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── Messages ──────────────────────────────────────────────────────────────────

// GET /api/admin/messages
router.get('/messages', adminProtect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json({ messages })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/admin/messages/:id/read
router.patch('/messages/:id/read', adminProtect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!msg) return res.status(404).json({ message: 'Message not found.' })
    res.json({ message: msg })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', adminProtect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

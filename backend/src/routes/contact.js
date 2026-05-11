import express from 'express'
import Message from '../models/Message.js'

const router = express.Router()

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required.' })

    const msg = await Message.create({ name, email, phone, message })
    res.status(201).json({ message: 'Message received. We will get back to you soon!', data: msg })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

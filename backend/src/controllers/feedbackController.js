import Feedback from '../models/Feedback.js'

export const getAllFeedback = async (_req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true }).sort({ createdAt: -1 })
    res.json(feedback)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' })
  }
}

export const createFeedback = async (req, res) => {
  try {
    const { name, rating, text, email, role } = req.body
    if (!name || !rating || !text) return res.status(400).json({ error: 'Name, rating, and message are required.' })
    const feedback = await Feedback.create({ name, rating, text, email, role })
    res.status(201).json({ message: 'Thank you for your feedback!', id: feedback._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' })
    res.json(feedback)
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve feedback.' })
  }
}

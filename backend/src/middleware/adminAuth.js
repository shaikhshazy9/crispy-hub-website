import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null

    if (!token) return res.status(401).json({ message: 'Admin access required.' })

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET)
    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin) return res.status(401).json({ message: 'Admin not found.' })

    req.admin = admin
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired admin token.' })
  }
}

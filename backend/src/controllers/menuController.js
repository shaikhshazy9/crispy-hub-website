import MenuItem from '../models/MenuItem.js'

export const getAllMenuItems = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category, available: true } : { available: true }
    const items = await MenuItem.find(filter).sort({ popular: -1, createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items.' })
  }
}

export const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: 'Menu item not found.' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ error: 'Menu item not found.' })
    res.json({ message: 'Menu item deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item.' })
  }
}

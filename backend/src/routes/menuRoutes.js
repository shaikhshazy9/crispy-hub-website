import { Router } from 'express'
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js'

const router = Router()

router.get('/',           getAllMenuItems)
router.post('/',          createMenuItem)
router.put('/:id',        updateMenuItem)
router.delete('/:id',     deleteMenuItem)

export default router

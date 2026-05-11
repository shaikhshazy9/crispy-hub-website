import { Router } from 'express'
import { getAllFeedback, createFeedback, approveFeedback } from '../controllers/feedbackController.js'

const router = Router()

router.get('/',             getAllFeedback)
router.post('/',            createFeedback)
router.patch('/:id/approve', approveFeedback)

export default router

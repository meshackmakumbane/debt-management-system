import express from 'express'
const router = express.Router()

import { getDebtAnalyticsController
} from '../controllers/analyticsControllers.js' 

import protect from '../middleware/protect.js'

router.get('/analytics', protect, getDebtAnalyticsController)

export default router
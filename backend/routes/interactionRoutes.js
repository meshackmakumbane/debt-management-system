import express from 'express'
const router = express.Router()

import { recordInteractions
} from '../controllers/interactionControllers.js'

import protect from '../middleware/protect.js'

router.post('/interations', protect, recordInteractions)

export default router
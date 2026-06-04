import express from 'express'
const router = express.Router()

import { overviewController
} from '../controllers/overviewControllers.js' 

import protect from '../middleware/protect.js'

router.get('/data', protect, overviewController)

export default router
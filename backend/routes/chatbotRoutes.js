import express from 'express'
const router = express.Router()

import { chatMessageController
} from '../controllers/chatbotControllers.js'

import protect from '../middleware/protect.js'

router.get('/message', protect, chatMessageController)

export default router
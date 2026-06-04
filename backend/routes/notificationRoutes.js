import express from 'express'
const router = express.Router()

import { getNotificationsController,
         readNotificationsController,
         readAllNotificationsController
} from '../controllers/notificationControllers.js'

import protect from '../middleware/protect.js'

router.get('/notifications', protect, getNotificationsController)
router.put('/notifications/:id', protect, readNotificationsController)
router.put('/notifications', protect, readAllNotificationsController)

export default router
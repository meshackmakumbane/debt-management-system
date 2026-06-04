import express from 'express'
const router = express.Router()

import { loginController,
         profileController,
         logoutController
} from '../controllers/authControllers.js'

import protect from '../middleware/protect.js'

/* AUTH ROUTES --------------------------------------------------*/
router.post('/login', loginController)
router.get('/profile', protect, profileController)
router.get('/logout', logoutController)

export default router
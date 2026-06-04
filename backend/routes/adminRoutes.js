import express from 'express'
const router = express.Router()

import { createAdminController,
         verificationController,
         resendCodeController
} from '../controllers/adminControllers.js'

router.post('/register', createAdminController)
router.post('/verify', verificationController)
router.post('/resend', resendCodeController)

export default router
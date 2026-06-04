import express from 'express'
const router = express.Router()

import { makePaymentController,
         createInstallmentController,
} from '../controllers/paymentControllers.js'

import protect from '../middleware/protect.js'

router.post('/payment', makePaymentController)
router.post('/installment', createInstallmentController)

export default router
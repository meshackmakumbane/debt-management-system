import express from 'express'
const router = express.Router()

import { 
        recordPaymentController, 
        createInstallmentController, 
        recordInstallmentPaymentController 
      } from '../controllers/financeController.js' 

/* RECORD PAYMENT -------------------------------------------------- */
router.post('/record-payment/:id', recordPaymentController)

/* CREATE INSTALLMENT PLAN -------------------------------------------------- */
router.post('/create-installment-plan', createInstallmentController)

/* RECORD INSTALLMENT PAYMENT -------------------------------------------------- */
router.post('/record-installment-payment', recordInstallmentPaymentController)

export default router
import express from 'express'
const router = express.Router()

import { getDebtsController,
         getDebtController,
         updateDebtController,
         deleteDebtController
} from '../controllers/debtControllers.js'

import protect from '../middleware/protect.js'

router.get('/debts', protect, getDebtsController)
router.post('/debts/:id', protect, getDebtController)
router.get('/debts/:id/update', protect, updateDebtController)
router.post('/debts/:id/delete', protect, deleteDebtController) 

export default router
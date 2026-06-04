import express from 'express'
const router = express.Router()

import {  getAllAgentsController,
          addAgentController,
          getAgentController,
          deleteAgentController,
          updateAgentController,

          getAllDebtorsController,
          addDebtorController,
          getDebtorController,
          updateDebtorController,
          deleteDebtorController
} from '../controllers/userControllers.js'

import protect from '../middleware/protect.js'

/*  AGENT CONTROLLERS ------------------------------------------------------*/

router.get('/agents', getAllAgentsController)
router.post('/agents', protect, addAgentController)
router.get('/agents/:id', protect, getAgentController)
router.delete('/agents/:id', protect,  deleteAgentController)
router.put('/agents/:id', protect, updateAgentController)

/*  DEBTOR CONTROLLERS ------------------------------------------------------*/

router.get('/debtors', getAllDebtorsController)
router.post('/debtors', protect, addDebtorController)
router.get('/debtors/:id', protect, getDebtorController)
router.delete('/debtors/:id', protect,  deleteDebtorController)
router.put('/debtors/:id', protect, updateDebtorController)

export default router
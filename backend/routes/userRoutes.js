import express from 'express'
const router = express.Router()

import { getBalanceController, 
         addAgentController, 
         addDebtorController, 
         getActiveInstallments,
         createAdminController,
         getDebtorController,
         getDebtsController,
         deleteDebtorController,
         getAllPayments,
         getTicketsController,
         addTicketController,
         recordInteractions,
         getAllAgentsController,
         getAllDebtorsController,
         getAgentController,
         deleteAgentController,
         getEachTicketController,
         replyticketController,
         getNotificationsController,
         readNotificationsController
} from '../controllers/userControllers.js'

import { protect } from '../middleware/protect.js'

/* GET OVERVIEW DATA FOR ADMIN --------------------------------*/
router.get("/overview", getBalanceController)

/* Add Debtor --------------------------------------------------*/
router.post("/add-debtor", addDebtorController)

/* Get Debtors --------------------------------------------------*/
router.get("/all-debtors", protect, getAllDebtorsController)

/* Get Each Debtor -----------------------------------------------*/
router.get("/debtor/:id", getDebtorController)

/* Delete Debtor --------------------------------------------------*/
router.delete("/debtor/:id",  deleteDebtorController)

/* Add Agent --------------------------------------------------*/
router.post("/add-agent", addAgentController)

/* Get Agents --------------------------------------------------*/
router.get("/all-agents", getAllAgentsController)

/* Get Agent by ID --------------------------------------------------*/
router.get('/agent/:id', getAgentController)

/* Delete Agent by ID --------------------------------------------------*/
router.delete('/agent/:id', deleteAgentController)

/* Get Debts -------------------------------------------------*/
router.get("/debts", protect, getDebtsController)

/* Get Tickets -------------------------------------------------*/
router.get("/tickets", protect, getTicketsController)

/* Get tickets --------------------------------------------------*/
router.get("/tickets", protect, getTicketsController)

/* Creating a new ticket --------------------------------------------------*/
router.post('/tickets', protect, addTicketController)

/* Get each ticket --------------------------------------------------*/
router.get("/tickets/:id", getEachTicketController)

/* Adding interactions --------------------------------------------------*/
router.post("/interaction/:id",  recordInteractions)

/* Adding interactions --------------------------------------------------*/
router.post("/ticket/:id", protect, replyticketController)

/* Get Installments --------------------------------------------------*/
router.get("/installments", getActiveInstallments)

/* Add Admin --------------------------------------------------*/
router.post("/seed-admin", createAdminController)

/* Agent payments --------------------------------------------------*/
router.get("/payments",  getAllPayments)

/* Get Notifications --------------------------------------------------*/
router.get("/notifications", protect,  getNotificationsController)

/* Mark Notification --------------------------------------------------*/
router.get("/notifications/:id", protect,  readNotificationsController)


export default router
























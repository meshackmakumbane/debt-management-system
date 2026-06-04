import express from 'express'
const router = express.Router()

import {  addTicketController,
          getTicketsController,
          getEachTicketController,
          replyTicketController,
          closeTicketController
} from '../controllers/ticketControllers.js'

import protect from '../middleware/protect.js'

/*  TICKETS CONTROLLERS ------------------------------------------------------*/

router.post('/tickets', protect, addTicketController)
router.get('/tickets', protect, getTicketsController)
router.get('/tickets/:id', protect, getEachTicketController)
router.patch('/tickets/:id/reply', protect, replyTicketController)
router.patch('/tickets/:id/close', protect, closeTicketController)

export default router
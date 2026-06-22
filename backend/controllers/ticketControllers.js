import { Ticket }  from '../models/ticket.js'
import { User } from '../models/user.js'
import { Notification }  from '../models/notification.js'


/* ------------------------------- TICKETS CONTROLLER ------------------------------*/

/* ADD TICKET --------------------------------------------------*/
export const addTicketController = async ( req, res, next ) => {

  try {

    const userId = req.user

    const { subject, priority, description, relatedDebtor, relatedDebt } = req.body

    if ( !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description required'
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const admin = await User.findOne({ role: 'admin', isActive: true })

    const ticket = await Ticket.create({
        ticketNumber: `TKT-${Date.now()}`,
        submittedBy: user._id,
        subject,
        priority,
        relatedDebtor,
        relatedDebt,
        description,
        assignedTo: admin?._id,
        attachments: req.file ? [req.file.path] : [],
        messages: [
          {
            sender: user._id,
            role: user.role,
            message: description
          }
        ]
      })

    if (admin) {
      await Notification.create({
        title: 'New Support Ticket',
        recipient: admin._id,
        type: 'new_ticket',
        message: `New support ticket ${ticket.ticketNumber}`
      })
    }

    res.status(201).json({
      success: true,
      message: 'Ticket created',
      ticket
    })

  } catch (error) {
    next(error)
  }

}

/* GET ALL TICKETS --------------------------------------------------*/
export const getTicketsController = async ( req, res, next ) => {

  try {

    let tickets;
    
    if (req.user.role === 'admin') {
      tickets = await Ticket.find()
        .populate('submittedBy','name email')
        .populate('messages.sender','name')
        .sort({ createdAt: -1})
    }

    else {
      tickets = await Ticket.find({ submittedBy: req.user._id})
      .populate('submittedBy','name role email')
      .populate('messages.sender','name')
      .sort({createdAt: -1})
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    })

  } catch (error) {
    next(error)
  }

}

/* GET EACH TICKET --------------------------------------------------*/
export const getEachTicketController = async ( req, res, next ) => {

  try {

    const { id } = req.params

    const ticket =
      await Ticket.findById(id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo','name')
      .populate('messages.sender','name')

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    res.status(200).json({
      success: true,
      ticket
    })

  } catch (error) {
    next(error)
  }

}

/* REPLY TICKET --------------------------------------------------*/
export const replyTicketController = async ( req, res, next ) => {

  try {

    const { id } = req.params
    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message required'
      })

    }

    const user = await User.findById(req.user._id)

    const ticket =await Ticket.findById(id)

    if( !user || !ticket ) {
      return res.status(404).json({
        success: false,
        message:'Not found'
      })
    }

    ticket.messages.push({
      sender: user._id,
      role: user.role,
      message
    })

    if ( ticket.status === 'open') {
      ticket.status = 'in progress'
    }

    await ticket.save()

    res.status(200).json({
      success: true,
      message: 'Reply added',
      ticket
    })

  } catch (error) {
    next(error)
  }

}

/* CLOSE TICKET --------------------------------------------------*/
export const closeTicketController = async ( req, res, next ) => {

  try {

    const {
      id
    } =
    req.params

    const ticket =
      await Ticket.findById(
        id
      )

    if (!ticket) {

      return res.status(404).json({
        success:
          false,

        message:
          'Ticket not found'
      })

    }

    ticket.status =
      'closed'

    ticket.resolvedAt =
      new Date()

    await ticket.save()

    res.status(200).json({

      success:
        true,

      message:
        'Ticket closed'

    })

  } catch (error) {
    next(error)
  }

}

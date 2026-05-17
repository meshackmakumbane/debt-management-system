import bcrypt from 'bcryptjs'
import { User } from '../models/user.js'
import { Notification } from '../models/notification.js'
import { Debt } from '../models/debt.js'
import { Installments } from '../models/installment.js'
import { Payment } from '../models/payment.js'
import { Interaction } from '../models/Interaction.js'
import { Ticket } from '../models/ticket.js'

import { generateAccessId, generatePassword, generateRefNumber } from '../utils/credentials.js'
import { sendWelcomeEmail } from '../emails/emails.js'


/* GET OVERVIEW DATA --------------------------------------------------*/
export const getBalanceController = async (req, res, next) => {
   try {
      const debtors = await User.find({ role: "debtor" })
      const agents = await User.find({ role: "agent" })
      const debts = await Debt.find()

      const totalOwed = debtors.reduce((sum, debtor) => {
         return sum + (debtor.balance || 0)
      }, 0)

      const totalAgents = await User.countDocuments({ role: "agent", isActive: true })
      const totalDebtors = await User.countDocuments({ role: "debtor", isActive: true })
      const totalDebts = await Debt.countDocuments()

      res.status(200).json({
         success: true,
         message: "Total Balances",
         debtors,
         agents,
         debts,
         totalDebts,
         totalOwed,
         totalAgents,
         totalDebtors,
      })

   } catch (error) {
      next(error)
   }
}

/* SEED ADMIN --------------------------------------------------*/
export const createAdminController = async (req, res, next) => {
   const { fullName, email, phoneNumber } = req.body
   try {
      const existingAdmin = await User.findOne({ role: "admin" })
      if (existingAdmin) {
         return res.status(400).json({
            success: false,
            message: "Admin already exists"
         })
      }

      const accessId = `DH${generateAccessId()}`
      const password = `DH${generatePassword()}`

      const hashedPassword = await bcrypt.hash(password, 10)

      const admin = await User.create({
         fullName,
         email,
         phoneNumber,
         password:hashedPassword,
         role: "admin",
         accessId,
      })

      await admin.save()

      res.status(200).json({
         success: true,
         message: 'Admin added successfully',
         admin,
         detials:{
            accessId,
            password
         }
      })
   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                              AGENT CONTROLLERS                                 */
/* -------------------------------------------------------------------------------*/

/* ADD AGENT --------------------------------------------------*/
export const addAgentController = async (req, res, next) => {
   const { fullName, email, phoneNumber } = req.body

   try {
      if (!fullName || !email || !phoneNumber) {
         return res.status(400).json({
            success: false,
            message: "All fields are required"
         })
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "Email already exists"
         })
      }

      const agentPassword = `DH${generatePassword()}`
      const hashedPassword = await bcrypt.hash(agentPassword, 10)

      const user = new User({
         fullName,
         email,
         phoneNumber,
         role: "agent",
         balance: undefined,
         accessId: `DH${generateAccessId()}`,
         password: hashedPassword
      })

      await user.save()

      await sendWelcomeEmail(user.fullName, user.email, user.accessId, agentPassword)

      res.status(201).json({
         success: true,
         message: "Agent added successfully",
         user: {...user, password:undefined}
      })

   } catch (err) {
      next(err)
   }
}

/* GET ALL AGENTS --------------------------------------------------*/
export const getAllAgentsController = async(req, res, next)=>{
   try {
      const agents = await User.find({role:'agent'})

      res.status(200).json({
         success: true,
         count: agents.length,
         agents
      })

   } catch (error) {
      next(error)
   }
}

/* GET EACH AGENT --------------------------------------------------*/
export const getAgentController = async(req, res, next) => {
   const { id } = req.params
   try{
      const agent = await  User.findById(id)
      if(!agent){
         return res.status(400).json({
            success: false,
            message: "Agent not found"
         })
      }

      res.status(200).json({
         success:true,
         agent
      })
   }catch(error){
      next(error)
   }
}

/* DELETE AGENT --------------------------------------------------*/
export const deleteAgentController = async(req, res, next) => {
    const { id } = req.params
   try{
      const deletedAgent = await User.findOneAndDelete({ 
         _id: id,
         role: "agent" 
      })

      if(!deletedAgent){
         return res.status(404).json({
            success:false,
            message: "Agent not found"
         })
      }

      res.status(200).json({
         success: true,
         message: "Agent deleted successfully"
      })
   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                              DEBTORS CONTROLLERS                                 */
/* -------------------------------------------------------------------------------*/

/* ADD DEBTOR --------------------------------------------------*/
export const addDebtorController = async (req, res, next) => {
   const { fullName, 
           email, 
           phoneNumber, 
           idNumber,
           balance, 
           primaryLender, 
           agentId,
           status
   } = req.body

   const userId = req.userId

   try {
      if (!fullName || !email || !phoneNumber || !idNumber || !primaryLender || !balance) {
         return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
         })
      }

      const existingDebtor = await User.findOne({ idNumber })
      if (existingDebtor) {
         return res.status(400).json({
            success: false,
            message: "Debtor already exists"
         })
      }

      const existingEmail = await User.findOne({ email })
      if (existingEmail) {
         return res.status(400).json({
            success: false,
            message: "Email already exists"
         })
      }

      const agent = await User.findById(agentId)
      const agentFullName = agent ? agent.fullName : undefined

      const user = new User({
         fullName,
         email,
         phoneNumber,
         idNumber,
         assignedAgent: agentId,
         agentName: agentFullName,
         refNumber: `REF${generateRefNumber()}`,
         balance: balance ||  0,
         role: "debtor",
         status,
      })

      agent.assignedDebtors.push(user._id)
      await agent.save()

      

      const debt = new Debt({
         debtorInfo:{
            debtor: user._id,
            fullName: user.fullName,
            refNumber: user.refNumber,
            idNumber: user.idNumber
         },
         primaryLender,
         agent: agentId,
         amount: balance || 0,
         balance: balance || 0,
         description: "Initial balance",
      })

      await debt.save()
      await user.save()
      const admin = await User.findOne({ role:"admin" })


      const notification = new Notification({
         recipient: admin._id,
         type:"debtor_added",
         message: `New debtor added: ${user.fullName} with balance of R ${balance.toFixed(2) || 0}`,
         relatedDebtor: user._id
      })

      await notification.save()
      
      res.status(201).json({
         success: true,
         message: "Debtor added successfully",
         user
      })

   } catch (err) {
      next(err)
   }
}

/* GET ALL DEBTORS --------------------------------------------------*/
export const getAllDebtorsController = async (req, res, next) => {
   const userId = req.userId
   try {
      let debtors;
      if(req.userRole === 'admin'){
         debtors = await User.find({
            role: 'debtor'
         })
      }else if(req.userRole === 'agent'){
         debtors = await User.find({
            role: 'debtor',
            assignedAgent: userId
         })
      }else{
         return res.status(400).json({
            success: false,
            message: "Debtors not found"
         })
      }

      res.status(200).json({
         success: true,
         count: debtors.length,
         debtors
      })

   } catch (error) {
      next(error)
   }
}

/* GET EACH DEBTOR --------------------------------------------------*/
export const getDebtorController = async(req, res, next) => {
   const { id } = req.params
   try{
      const debtor = await  User.findById(id)
      if(!debtor){
         return res.status(400).json({
            success: false,
            message: "Debtor not found"
         })
      }

      res.status(200).json({
         success:true,
         debtor
      })
   }catch(error){
      next(error)
   }
}

/* DELETE DEBTOR --------------------------------------------------*/
export const deleteDebtorController = async(req, res, next)=>{
   const { id } = req.params
   try{
      const deletedDebtor = await User.findOneAndDelete({ 
         _id: id,
         role: "debtor" 
      })

      if(!deletedDebtor){
         return res.status(404).json({
            success:false,
            message: "Debtor not found"
         })
      }

      res.status(200).json({
         success: true,
         message: "Debtor deleted successfully"
      })
   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                         DEBTS CONTROLLER(ROLE-BASED)                           */
/* -------------------------------------------------------------------------------*/

/* GET DEBTS  --------------------------------------------------*/
export const  getDebtsController = async (req, res, next) => {
   const userId = req.userId

   try {
     let debts;
     if(req.userRole === 'admin'){
        debts = await Debt.find()
     } else if(req.userRole === 'agent'){
        debts = await Debt.find({ agent: userId })
     } else if(req.userRole === 'debtor'){
        debts = await Debt.find({ debtor: userId })
     }else{
      return res.status(403).json({
         success: false,
         message: "Unauthorized access"
      })
     }

     res.status(200).json({
      success: true,
      debts
     })

   } catch (error) {
      next(error)
   }
}

/* GET INSTALLMENTS --------------------------------------------------*/
export const getActiveInstallments = async (req, res, next) => {
  const userId = req.userId
  try {
    let installments;
    if(req.userRole === 'admin'){
      installments = await Installments.find()
    }else if(req.userRole === 'agent'){
      installments = await Installments.find({
         createdBy: userId,
      })
    }else if(req.userRole === 'debtor'){
      installments = await Installments.find({
         relatedDebtor: userId
      })
    }else{
      return res.status(400).json({
         success: false,
         message: 'Installment not found'
      })
    }

    res.status(200).json({
      success: true,
      installments
    })

  } catch (error) {
    next(error)
  }
}

/* GET PAYMENTS --------------------------------------------------*/
export const getAllPayments = async(req, res, next)=>{
   const userId = req.userId
   try{
     let payments;
     if(req.userRole === "admin"){
      payments = await Payment.find()
     }else if(userRole === 'agent'){
      payments = await Payment.find({
         agent: userId
      })
     }else if(userRole === 'debtor'){
      payments = await Payment.find({
         debtor: userId
      })
     }else{
      return res.status(400).json({
         success: false,
         message: "Payments not found"
      })
     }

     res.status.json({
      success: true,
      payments
     })
   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                   NOTIFICATION CONTROLLER(ROLE-BASED)                         */
/* -------------------------------------------------------------------------------*/

/* GET NOTIFICATIONS --------------------------------------------------*/
export const getNotificationsController = async (req, res, next) => {
   const userId = req.userId
   try {
      const notifications = await Notification.find({
         recipient: userId,
         read: false
      }).sort({ createdAt: -1 })

      res.status(200).json({
         success: true,
         notifications, 
         count: notifications.length,
         message: notifications.length === 0 ? "You're all caught up" : undefined
      })

   } catch (error) {
      next(error)
   }
}

/* MARK NOTIFICATION AS READ --------------------------------------------------*/
export const readNotificationsController = async (req, res, next) => {
   const { id } = req.params
   const { userId } = req.userId
   try {
      const user = await User.findOne({
         _id: userId
      })

      if(!user){
         return res.status(400).json({
            success: false,
            message: 'Unauthorired Access'
         })
      }
      
      const notification = await Notification.findBtId({
         _id: id,
         recipient: userId
      })

      if(!notification){
         return res.status(400).json({
            success: false,
            message: 'Notification not found'
         })
      }

      await Notification.findOneAndUpdate(
         {_id: id},
         {$set:{read: true}},
         {
            returnDocument: true,
            runValidators: true,
         }
      )

      res.status(200).json({
         success: true,
         notification
      })

   } catch (error) {
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                       TICKET CONTROLLER(ROLE-BASED)                            */
/* -------------------------------------------------------------------------------*/

/* ADD TICKET --------------------------------------------------*/
export const addTicketController = async (req, res, next)=>{
   const userId = req.userId
   const { subject, priority, description, attachments } = req.body
   try{

      const agent = await User.findById(userId)
      if(!agent){
         return res.status(200).json({
            success: false,
            message:"Agent not found"
         })
      }

      const tickets = await Ticket.find()
      const ticketingNumber = `TKT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const admin = await User.findOne({
         role: 'admin',
         isActive: true
      })

      /* ----- HANDLE FILE UPLOAD ----- */
      // const storage = mutler.diskStorage({
      //    destination : (req, file, cb)=>{
      //       cb(null, 'uploads')
      //    },
      //    filename:(req, file, cb) =>{
      //       const uniquename = Date.now() + "-" + file.originalname
      //       cb(null, uniquename)
      //    }
      // })

      // const upload = multer({storage})


      const message = {
         sender: {
            userId: agent._id,
            name: agent.fullName,
            role: agent.role
         },
         message: description,
         createdAt: Date.now()
      }

      const newTicket = await Ticket.create({
         ticketNumber: ticketingNumber,
         submittedBy: {
            agentId: agent._id,
            fullName: agent.fullName,
            email:agent.email,
            phoneNumber: agent.phoneNumber
         },
         subject,
         priority,
         // clientAccountId: ,
         // attachments,
         description,
         assignedTo: admin._id,
         messages:[message]
      })

      //Notification to admin
      await Notification.create({
         recipient: admin._id,
         type: "new_ticket",
         message: `A new ticket is open ${newTicket.ticketNumber}`,
      })

      res.status(200).json({
         success: true,
         message: 'New ticket added',
         newTicket,
      })

   }catch(err){
      next(err)
   }
}

/* GET ALL TICKETS --------------------------------------------------*/
export const getTicketsController = async (req, res, next)=>{
   const userId = req.userId
   try{
      let tickets;
      const admin = await User.findOne({
         role:'admin',
         isActive:true
      })
      if(admin){
         tickets = await Ticket.find({}).sort({createdAt: -1})
      } else{
         tickets = await Ticket.find({
            $or:[
               { submittedBy: userId },
               { assignedTo: userId }
            ]
         })
      }
      res.status(200).json({
         success: true,
         tickets
      })
   }catch(err){
      next(err)
   }
}

/* GET EACH TICKETS --------------------------------------------------*/
export const getEachTicketController = async (req, res, next) => {
   const { Id } = req.params
   try {
      const ticket = await Ticket.findById(id)
      if (!ticket) {
         return res.status(400).json({
            success: false,
            message:"No ticket found"
         })
      }

      res.status(200).json({
         success:true,
         message:"Ticket found!",
         ticket
      })
   } catch (error) {
      next(error)
   }
}

/* REPLY TICKETS --------------------------------------------------*/
export const replyticketController = async (req, res, next) => {
   const { id } = req.params
   const userId = req.userId
   const { description } = req.body
   try{
      const user = await User.findById(userId)
      if(!user){
         return res.status(400).json({
            success: false,
            message: "User not found"
         })
      }

      const ticket = await Ticket.findById(id)
      if(!ticket){
         return res.status(400).json({
            success: false,
            message: "Ticket not found"
         })
      }

      const message = {
         sender: {
            userId: user._id,
            name: user.fullName,
            role: user.role
         },
         message: description,
         createdAt: new Date()
      }

      const newStatus = user.role === "admin" ? "close" : "open";

      await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      {
         $push: { messages: message },
         $set: { status: newStatus },
      },
      {
         returnDocument: true,
         runValidators: true,
      }
      );

      res.status(201).json({
         success: true,
         message: "Message sent successfully",
         message
      })

   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                       INTERACTION CONTROLLER(ROLE-BASED)                       */
/* -------------------------------------------------------------------------------*/

/* RECORD INTERACTION --------------------------------------------------*/
export const recordInteractions = async(req,res, next)=>{
   const userId = req.userId
   const { id } = req.params
   const { notes, method, date, outcome } = req.body
   try{
      const agent = await User.findById(userId)
      if(!agent){
         return res.status(200).json({
            success: false,
            message:"Agent not found"
         })
      }

      const debtor = await User.findById(id)
      if(!debtor){
         return res.status(200).json({
            success: false,
            message:"debtor not found"
         })
      }

      const interaction = new Interaction({
         relatedDebtor: debtor._id,
         relatedAgent: agent._id,
         method,
         notes,
         date,
         outcome
      })

      await interaction.save()

      const admin = await User.findOne({role:"admin", isActive: true})
      //Notification to admin
      await Notification.create({
         recipient: admin._id,
         type: "interaction_made",
         message: `Interaction between ${agent.fullName} and ${debtor.fullName} via ${method} - Here are the notes ${notes}`,
         relatedDebtor: debtor._id
      })

      res.status(200).json({
         success: true,
         interaction
      })

   }catch(err){
      next(err)
   }
}















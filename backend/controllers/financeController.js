import { User } from '../models/user.js'
import { Debt } from "../models/debt.js"
import { Installments } from "../models/installment.js"
import { Notification } from '../models/notification.js'
import { Payment } from '../models/payment.js'


/* MAKE PAYMENT -------------------------------------------------- */
export const makePaymentController = async(req, res, next)=>{
   try {
    const { amount, debtId } = req.body

    const debt = await Debt.findById(debtId)

    if (!debt) {
      return res.status(404).json({ message: "Debt not found" })
    }

    if (amount > debt.remainingAmount) {
      return res.status(400).json({ message: "Amount too high" })
    }

    // create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      debtId,
      amount,
      reference: `REF-${Date.now()}`,
      status: "SUCCESS",
      method: "SIMULATED_BANK"
    })

    // update debt
    debt.remainingAmount -= amount

    if (debt.remainingAmount === 0) {
      debt.status = "PAID"
    }

    await debt.save()

    res.json({
      message: "Payment successful",
      transaction
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


/* RECORD PAYMENT -------------------------------------------------- */
export const recordPaymentController = async(req, res, next)=>{
   const { id } = req.params
   const { amount, method, status, paidAt } = req.body
   const userId = req.userId
   try{
      const relatedDebtor = await User.findOne({
         _id:id
      })

      if(!debtor){
         return res.status(400).json({
            success: false,
            message: "Debtor not found"
         })
      }

      const relatedAgent = await User.findOne({
         _id: userId
      })

      const transactions = ()=>{
         return Math.floor(1000000 + Math.random * 9000000)
      }

      const payment = new Payment({
         debtor: relatedDebtor._id,
         agent: relatedAgent._id,
         amount,
         method,
         status,
         refNumber: relatedDebtor.refNumber,
         transactionNumber: `Ref${transactions()}`,
         paidAt
      })
      await payment.save()

      //update debt
      const debt = await Debt.find({
         debtor: relatedDebtor._id,
         agent: relatedAgent._id
      })

      const updatedAmount = debt.amount || 0 - amount
      const paymentHistory = [payment]

      debt.amount = updatedAmount
      debt.amountPaid = amount
      debt.balance = updatedAmount
      debt.paymentHistory.push(payment)

      //Update debt status
      if (debt.balance <= 0) {
         debt.balance = 0
         debt.status = "paid"
      } else if (debt.amountPaid > 0) {
         debt.status = "partial"
      }

      await debt.save()
      const admin = await User.findOne({role:"admin", isActive: true})
      //Notification to admin
      await Notification.create({
         recipient: admin._id,
         type: "payment_made",
         message: `Payment of R${amount} received from ${debt.debtor.fullName}`,
         relatedDebtor: debt.debtor._id
      })

      res.status(200).json({
         success: true,
         message: "Payment added successfully"
      })
   }catch(error){
      next(error)
   }
}






/* CREATE INSTALLMENT PLAN -------------------------------------------------- */
export const createInstallmentController = async (req, res, next) => {
   const {
      debtorId,
      originalBalance,
      installmentAmount,
      frequency,
      totalInstallments
   } = req.body

   const userId = req.userId

   try {
      if (!debtorId || !originalBalance || !installmentAmount || !totalInstallments) {
         return res.status(400).json({
            success: false,
            message: "Missing required fields"
         })
      }

      const debtor = await User.findById(debtorId)

      if (!debtor || debtor.role !== "debtor") {
         return res.status(404).json({
            success: false,
            message: "Debtor not found"
         })
      }

      const installment = await Installments.create({
         relatedDebtor: debtorId,
         createdBy: userId,
         originalBalance,
         installmentAmount,
         frequency,
         totalInstallments,
         installmentsPaid: 0,
         amountPaid: 0,
         remainingBalance: originalBalance,
         startDate: new Date(),
         nextDueDate: new Date(),
         status: "active"
      })

      res.status(201).json({
         success: true,
         message: "Installment plan created",
         installment
      })

   } catch (error) {
      next(error)
   }
}

/* RECORD INSTALLMENT PAYMENT -------------------------------------------------- */
export const recordInstallmentPaymentController = async (req, res, next) => {
   const { installmentId, amount, method, transactionNumber } = req.body
   const userId = req.userId

   try {
      const installment = await Installments.findById(installmentId)

      if (!installment) {
         return res.status(404).json({
            success: false,
            message: "Installment not found"
         })
      }

      //Update payment totals
      installment.amountPaid += amount
      installment.installmentsPaid += 1
      installment.remainingBalance =
         installment.originalBalance - installment.amountPaid

      //Push payment history
      installment.paymentHistory.push({
         amount,
         method,
         transactionNumber,
         recordedBy: userId
      })

      //Update status
      if (installment.remainingBalance <= 0) {
         installment.remainingBalance = 0
         installment.status = "completed"
      }

      //Calculate next due date
      if (installment.status === "active") {
         const nextDate = new Date()
         if (installment.frequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7)
         } else {
            nextDate.setMonth(nextDate.getMonth() + 1)
         }
         installment.nextDueDate = nextDate
      }

      await installment.save()

      //Notification
      const admin = await User.findOne({role:"admin", isActive: true})
      await Notification.create({
         recipient: admin._id,
         type: "installment_plan",
         message: `Installment payment of R${amount} received`,
         relatedDebtor: installment.relatedDebtor
      })

      res.status(200).json({
         success: true,
         message: "Payment recorded successfully",
         installment
      })

   } catch (error) {
      next(error)
   }
}
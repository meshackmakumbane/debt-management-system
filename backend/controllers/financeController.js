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

      if(!relatedDebtor){
         return res.status(400).json({
            success: false,
            message: "Debtor not found"
         }) 
      }

      const relatedAgent = await User.findOne({
         assignedDebtors: relatedDebtor._id 
         
      })

      if(!relatedAgent){
         return res.status(400).json({
            success: false,
            message: "Agent not found"
         }) 
      }

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
         transactionNumber: `transaction-${transactions()}`,
         paidAt
      })
      await payment.save()
      const updatedAmount = relatedDebtor.balance - Number(amount)

      /*----- update debt ----- */
      const debt = await Debt.findOneAndUpdate(
         {
            debtor: relatedDebtor._id,
            agent: relatedAgent._id
         },
         {
            $set:{
            amount,
            amountPaid: amount,
            balance: updatedAmount
            },
            $push:{
               paymentHistory: payment 
            },

         }
      )

      /* ----- Update debt status -----*/
      // if (debt.balance <= 0) {
      //    debt.balance = 0
      //    debt.status = "paid"
      // } else if (debt.amountPaid > 0) {
      //    debt.status = "partial"
      // }

      //await debt.save()
      const admin = await User.findOne({role:"admin", isActive: true})
      //Notification to admin
      await Notification.create({
         recipient: admin._id,
         type: "payment_made",
         message: `Payment of R${amount} received from ${relatedDebtor.fullName}`,
         relatedDebtor: relatedDebtor._id
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
export const createInstallmentController = async (
  req,
  res,
  next
) => {
  const {
    debtId,
    installmentAmount,
    frequency,
    totalInstallments,
    nextDueDate,
    notes
  } = req.body

  const userId = req.userId

  try {

    if (
      !debtId ||
      !installmentAmount ||
      !totalInstallments ||
      !nextDueDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    const debt =
      await Debt.findById(debtId)

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: "Debt not found"
      })
    }

    const existing =
      await Installment.findOne({
        debt: debtId,
        status: "active"
      })

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Active installment already exists"
      })
    }

    const endDate =
      new Date(nextDueDate)

    if (frequency === "weekly") {
      endDate.setDate(
        endDate.getDate() +
        (7 * totalInstallments)
      )
    } else {
      endDate.setMonth(
        endDate.getMonth() +
        totalInstallments
      )
    }

    const installment =
      await Installment.create({

        debt:
          debt._id,

        debtor:
          debt.debtorInfo.debtor,

        createdBy:
          userId,

        originalBalance:
          debt.balance,

        installmentAmount,

        frequency,

        totalInstallments,

        remainingBalance:
          debt.balance,

        nextDueDate,

        endDate,

        notes,

        status:
          "active"
      })

    debt.status = "partial"

    await debt.save()

    res.status(201).json({
      success: true,
      message:
        "Installment created successfully",
      installment
    })

  } catch (error) {
    next(error)
  }
}

/* RECORD INSTALLMENT PAYMENT -------------------------------------------------- */
export const recordInstallmentPaymentController =
async (
  req,
  res,
  next
) => {

  const {
    installmentId,
    amount
  } = req.body

  try {

    const installment =
      await Installment.findById(
        installmentId
      )

    if (!installment) {
      return res.status(404).json({
        success: false,
        message:
          "Installment not found"
      })
    }

    const debt =
      await Debt.findById(
        installment.debt
      )

    if (!debt) {
      return res.status(404).json({
        success: false,
        message:
          "Debt not found"
      })
    }

    if (
      amount <= 0 ||
      amount >
      installment.remainingBalance
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid amount"
      })
    }

    // INSTALLMENT UPDATE

    installment.amountPaid += amount

    installment.remainingBalance -= amount

    installment.installmentsPaid += 1

    // DEBT UPDATE

    debt.amountPaid += amount

    debt.balance -= amount

    // STATUS

    if (
      installment.remainingBalance <= 0
    ) {

      installment.remainingBalance = 0

      installment.status =
        "completed"

      debt.balance = 0

      debt.status =
        "paid"
    }

    else {

      installment.status =
        "active"

      debt.status =
        "partial"

      const next =
        new Date(
          installment.nextDueDate
        )

      if (
        installment.frequency ===
        "weekly"
      ) {
        next.setDate(
          next.getDate() + 7
        )
      } else {
        next.setMonth(
          next.getMonth() + 1
        )
      }

      installment.nextDueDate =
        next
    }

    await installment.save()

    await debt.save()

    const admin =
      await User.findOne({
        role: "admin",
        isActive: true
      })

    if (admin) {
      await Notification.create({
        recipient:
          admin._id,

        type:
          "payment_made",

        message:
          `Installment payment of R${amount} received`,

        relatedDebtor:
          installment.debtor,

        metadata: {
          installmentId:
            installment._id
        }
      })
    }

    res.status(200).json({
      success: true,
      message:
        "Installment payment recorded",
      installment
    })

  } catch (error) {
    next(error)
  }
}
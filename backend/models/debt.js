import mongoose from 'mongoose'

const debtSchema = new mongoose.Schema({
   debtorInfo: {
      debtor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      fullName: {
         type: String,
         required: true
      },
      refNumber: {
         type: String,
         required: true
      },
      idNumber: {
         type: String,
         required: true
      }
   },

   agent: {
      agentId:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      fullName:String
   },
   
   primaryLender: {
      type: String,
      required: true
   },

   amount: {
      type: Number,
      required: true
   },

   amountPaid: {
      type: Number,
      default: 0
   },

   balance: {
      type: Number,
      required: true
   },

   dueDate: {
      type: Date
   },

   status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending'
   },

   description: {
      type: String
   },
   paymentHistory: []

}, { timestamps: true })

export const Debt = mongoose.model('Debt', debtSchema)
import mongoose from 'mongoose'

const debtSchema = new mongoose.Schema({
   debtorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   agentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
   isActive:{
      type:Boolean,
      default: true
   },
   organizationId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Organization',
   required: true,
   index: true,
   },
   paymentHistory: []

}, { timestamps: true })

export const Debt = mongoose.model('Debt', debtSchema)
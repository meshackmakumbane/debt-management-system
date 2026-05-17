import mongoose from 'mongoose'

const installmentSchema = new mongoose.Schema({
   relatedDebtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },

   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },

   // Terms
   originalBalance: {
      type: Number,
      required: true,
      min: 0
   },

   installmentAmount: {
      type: Number,
      required: true,
      min: 1
   },

   frequency: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'monthly',
      required: true
   },

   totalInstallments: {
      type: Number,
      required: true
   },

   installmentsPaid: {
      type: Number,
      default: 0
   },

   amountPaid: {
      type: Number,
      default: 0
   },

   remainingBalance: {
      type: Number,
      required: true
   },

   nextDueDate: {
      type: Date,
      default: Date.now
   },

   startDate: {
      type: Date,
      default: Date.now
   },

   status: {
      type: String,
      enum: ['active', 'completed', 'defaulted', 'cancelled'],
      default: 'active'
   },

   paymentHistory: [
      {
         amount: Number,
         paidAt: {
            type: Date,
            default: Date.now
         },
         method: {
            type: String,
            enum: ['eft', 'cash', 'debit_order']
         },
         recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
         },
         transactionNumber: String,
         status: {
            type: String,
            enum: ['paid', 'pending', 'overdue']
         },
      }
   ]

}, { timestamps: true })

// calculate before saving
installmentSchema.pre('save', function (next) {
   this.remainingBalance = this.originalBalance - this.amountPaid

   if (this.remainingBalance <= 0) {
      this.status = 'completed'
      this.remainingBalance = 0
   }

   next()
})

export const Installments = mongoose.model('Installment', installmentSchema)
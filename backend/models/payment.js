import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  debtor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  agent:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount:{
    type: Number,
    required: true
  },
  method:{
    type:String,
    enum:["debit_order", "eft", "cash"]
  },
  status:{
    type:String,
    enum:['paid', 'pending', 'overdue']
  },
  refNumber:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  transactionNumber:String,
  paidAt:{
    type: Date,
    required: true
  }
}, {timestamps: true})

export const Payment = mongoose.model("Payments", paymentSchema)
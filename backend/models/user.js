import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: true,
      trim: true
   },

   email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true
   },

   phoneNumber: {
      type: String
   },

   password: {
      type: String,
      required: function () {
         return this.role === 'agent' || this.role === 'admin'
      }
   },

   role: {
      type: String,
      enum: ['debtor', 'agent', 'admin'],
      default: 'debtor'
   },

   accessId: {
      type: String,
      required: function () {
         return this.role === 'agent' || this.role === 'admin'
      },
      unique: true,
      sparse: true
   },

   idNumber: {
      type: String,
      required: function () {
         return this.role === 'debtor'
      },
      unique: true,
      sparse: true
   },

   refNumber: {
      type: String,
      required: function () {
         return this.role === 'debtor'
      }
   },

   balance: { 
      type: Number,
      default: 0
   },

   status: {
      type: String,
      enum: ['pending', 'overdue', 'paid', 'arrangement'],
      default: 'pending'
   },

   assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },

   agentName:{
      type:String,
      required: function (){
         return this.role === 'debtor'
      }
   },

   assignedDebtors:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User"
   },

   isActive: {
      type: Boolean,
      default: true
   },

   lastLogin: {
      type: Date,
      default: Date.now
   },

   notes: {
      type: String
   }

}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
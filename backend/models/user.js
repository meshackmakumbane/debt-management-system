import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function (){
        return this.role === 'admin' || this.role === "agent"
      },
      minlength: 6,
    },

    idNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function (){
        return this.role === 'debtor'
      }
    },

    refNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function (){
        return this.role === 'debtor'
      }
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      required: function (){
        return this.role === 'admin' || this.role === 'agent'
      }
    },

    role: {
      type: String,
      enum: ['super_admin','admin', 'agent', 'debtor'],
      default: 'debtor',
    },

    phone: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    debtId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debt",
      index: true,
    },
    lastLogin:{
      type: Date,
      default: Date.now()
    },
    verificationCode:String,
    verificationCodeExpiresAt: Date
  },
  { timestamps: true } 
)

export const User = new mongoose.model('User', userSchema)
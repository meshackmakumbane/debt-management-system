import mongoose from 'mongoose'

const organizationSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  slug:{
    type:String,
    unique: true,
    index: true
  },
  ownerUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  plan:{
    type: String,
    enum: ['demo', 'free', 'pro'],
    default: 'free'
  },
  status:{
    type: String,
    enum:['pending', "active"],
    default: 'pending'
  }
}, {timestamps: true})

export const Organization = new mongoose.model("Organization", organizationSchema)
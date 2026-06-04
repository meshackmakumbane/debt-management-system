import bcrypt from 'bcryptjs'

import { User } from '../models/user.js'
import { Organization } from '../models/organization.js'

import { generatePassword, generateVerificationCode, generateEmployeeId } from '../utils/credentials.js'
import { sendVerificationEmail } from '../emails/emails.js'

/* CREATE ADMIN + ORGANIZATION -------------------------------------------------------- */
export const createAdminController = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      organizationName,
    } = req.body

    if (!name || !email || !phone || !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    const existingAdmin = await User.findOne({ email })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
    }


    const newPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const verificationCode = generateVerificationCode()

    const slug = organizationName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    /* ----- Create organization first ----- */
    const organization = await Organization.create({
      name: organizationName,
      slug,
      plan: 'free',
    })

    /* ----- Create Admin ----- */
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      employeeId: generateEmployeeId(),
      role: 'admin',
      phone,

      organizationId: organization._id,

      verificationCode,

      verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    /* ----- Attach owner ----- */
    organization.ownerUserId = admin._id
    await organization.save()

    /* ----- Send verification ----- */
    await sendVerificationEmail(
      admin.email,
      admin.name,
      verificationCode
    )

    res.status(201).json({
      success: true,
      message:'Account created. Please verify your email.',
      credentails:{
        password: newPassword
      }
    })

  } catch (error) {
    next(error)
  }
}

/* VERIFICATION  -------------------------------------------------------- */
export const verificationController = async (req, res, next) => {
  try{
    const { code } = req.body

    const admin = await User.findOne({
      verificationCode: code,
      verificationCodeExpiresAt: {$gt: Date.now()} 
    })

    if(!admin){
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired code',
      })
    }

    admin.verificationCode = undefined,
    admin.verificationCodeExpiresAt = undefined
    admin.isActive = true
    await admin.save()

    const organization = await Organization.findOne({
      ownerUserId: admin._id
    })

    if(!organization){
      return res.status(400).json({
        success: false,
        message: 'No organization found',
      })
    }

    organization.status = "active"
    await organization.save()

    res.status(201).json({
      success: true,
      message:'Email verified and organization created',
    })

  }catch(error){
    next(error)
  }
}

/* RESEND VERIFICATION  -------------------------------------------------------- */
export const resendCodeController = async (req, res, next) =>{
  const { email } = req.body
  try {
    const user = await User.findOne({
      email
    })
    if(!user){
      return res.status(404).json({
        success: false,
        message: "Email not found"
      })
    }

    const code = generateVerificationCode()
    user.verificationCode = code
    user.verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()


    /* ----- Send verification ----- */
    await sendVerificationEmail(user.email, user.name, code)

    return res.status(200).json({
      success: true,
      message:
        'Verification code sent successfully'
    })

  } catch (error) {
    next(error)
  }
}
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { jwt } from 'jsonwebtoke'

import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'

/* LOGIN -------------------------------------------------------------------------- */
export const loginController = async ( req, res, next ) => {
  try {
    const { employeeId, password, refNumber, idNumber } = req.body

    let user = null

    /* -------------------------- DEBTOR LOGIN -------------------------- */

    const isDebtorLogin = Boolean(refNumber && idNumber)

    if (isDebtorLogin) {

      user = await User.findOne({ refNumber, idNumber,
          role: 'debtor',
          isActive: true
        }).select('-password')
    }

    /* -------------------------- STAFF LOGIN -------------------------- */

    const isStaffLogin = Boolean(employeeId && password)

    if (!user && isStaffLogin) {

      const existingUser = await User.findOne({ employeeId,
          role: {
            $in: ['admin', 'agent']
          },
          isActive: true
        })

      if ( existingUser && existingUser.password ) {
        const match = await bcrypt.compare(password, existingUser.password)
        if (match) {
          user = existingUser.toObject()
          delete user.password
        }
      }
    }

    /* -------------------------- INVALID LOGIN -------------------------- */

    if (!user) { return res.status(401).json({
        success: false,
        message: 'Invalid credentialss'
      })
    }

    /* -------------------------- UPDATE LOGIN -------------------------- */

    await User.findByIdAndUpdate( user._id,
      { lastLogin:new Date() }
    )

    /* --------------------------- AUTH TOKEN --------------------------- */

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })

    /* ---------------------------- RESPONSE ---------------------------- */

    return res.status(200).json({
      success: true,
      message:'Login successful',
      token,
      user
    })

  } catch (error) {
    next(error)
  }
}

/* PROFILE -------------------------------------------------------------------------- */
export const profileController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

/* LOGOUT -------------------------------------------------------------------------- */
export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}
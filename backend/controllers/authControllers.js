import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';

import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';


/* LOGIN -------------------------------------------------------------------------- */
export const loginController = async (req, res, next) => {
  try {
    const { accessId, password, refNumber, idNumber } = req.body;

    let user = null;

    /* ---------------------------- Debtor Login ---------------------------- */

    const isDebtorLogin = idNumber && refNumber;

    if (isDebtorLogin) {
      user = await User.findOne({
        idNumber,
        refNumber,
        role: 'debtor',
      });
    }

    /* ------------------------- Admin / Agent Login ------------------------ */

    const isStaffLogin = accessId && password;

    if (isStaffLogin) {
      const existingUser = await User.findOne({
        accessId,
        role: { $in: ['admin', 'agent'] },
      });

      if (
        existingUser &&
        existingUser.password &&
        (await bcrypt.compare(password, existingUser.password))
      ) {
        user = existingUser;
      }
    }

    /* --------------------------- Invalid Login ---------------------------- */

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    /* ------------------------------ Auth Token ----------------------------- */

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    /* ------------------------------- Response ------------------------------ */

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {...user, password:undefined, accessId:undefined}
    });
  } catch (error) {
    next(error);
  }
};


/* PROFILE -------------------------------------------------------------------------- */
export const profileController = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');

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
};


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
};
import { Notification } from '../models/notification.js'

/* ----------------------------- NOTIFICATION CONTROLLER (ROLE-BASED) -----------------------------*/

/* GET NOTIFICATIONS --------------------------------------------------*/
export const getNotificationsController = async ( req, res, next ) => {
  const userId = req.user._id
  try {
    const notifications = await Notification.find(
      { 
        recipient: userId,
        read: false
      })
      .sort({ createdAt: -1})
      .lean()

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
      message: notifications.length === 0 ? "You're all caught up" : undefined
    })

  } catch (error) {
    next(error)
  }

}

/* MARK NOTIFICATION AS READ --------------------------------------------------*/
export const readNotificationsController = async ( req, res, next ) => {

  const { id } = req.params

  const userId = req.user._id

  try {

    const notification =
      await Notification.findOneAndUpdate(
        { 
          _id: id,
          recipient: userId
        },
        { read: true },
        { new: true }
      )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.status(200).json({
      success: true, 
      message: 'Notification marked as read',
      notification
    })

  } catch (error) {
    next(error)
  }

}

/* MARK ALL AS READ --------------------------------------------------*/
export const readAllNotificationsController = async ( req, res, next) => {
  const userId = req.user._id

  try {

    const updated = await Notification.updateMany(
        {
          recipient:userId,
          read: false
        },
        {
          $set: { read: true }
        }
  )

      res.status(200).json({
        success: true,
        message: 'Notifications updated',
        modified: updated.modifiedCount
      })

  } catch (error) {
    next(error)
  }

} 
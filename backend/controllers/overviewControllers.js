import { Debt } from '../models/debt.js'
import { User } from '../models/user.js'
import { Organization } from '../models/organization.js'

export const overviewController = async (req, res, next) => {
  try {
    const { role, organizationId } = req.user

    const user = await User.findById(req.user)

    if(!user){
      return res.status(403).json({
        success: false,
        message: 'Unauthorized Access',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin Access only',
      })
    }

    const organization = await Organization
      .findById(user.organizationId)
      .lean()

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      })
    }

    const [debtors, agents, debts] = await Promise.all([
      User.find({
        role: 'debtor',
        organizationId: user.organizationId,
      })
        .select('-password')
        .lean()
        .populate()
        ,

      User.find({
        role: 'agent',
        organizationId: user.organizationId,
      })
        .select('-password')
        .lean(),

      Debt.find({
        organizationId: user.organizationId,
        isActive: true,
      }).lean(),
    ])

    return res.status(200).json({
      success: true,

      organization,

      counts: {
        debtors: debtors.length,
        agents: agents.length,
        debts: debts.length,
      },

      data: {
        debtors,
        agents,
        debts,
      },
    })
  } catch (error) {
    next(error)
  }
}
import bcrypt from 'bcryptjs'
import { User } from '../models/user.js'
import { Organization } from '../models/organization.js'
import { Notification } from '../models/notification.js'
import { Debt } from '../models/debt.js'

import { generateEmployeeId, generatePassword, generateRefNumber } from '../utils/credentials.js'
import { sendWelcomeEmail, sendInstallmentCreatedEmail, sendDebtorAlert } from '../emails/emails.js'

/* --------------------------- AGENT CONTROLLERS ---------------------------*/

/* GET ALL AGENTS --------------------------------------------------*/
export const getAllAgentsController = async (req, res, next) => {
  try {
    const { q, page, limit, isActive } = req.query

    // FILTER OBJECT
    const filter = {
      role: 'agent',
    }

    // SEARCH
    if (q) {
      filter.name = {
        $regex: q,
        $options: 'i',
      }
    }

    // ACTIVE FILTER
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    // PAGINATION
    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || 10

    const skip =
      (pageNumber - 1) * limitNumber

    // QUERY
    const agents = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })

    // TOTAL COUNT
    const totalAgents =
      await User.countDocuments(filter)

    res.status(200).json({
      success: true,

      data: agents,

      pagination: {
        total: totalAgents,
        page: pageNumber,
        pages: Math.ceil(
          totalAgents / limitNumber
        ),
        limit: limitNumber,
      },
    })
  } catch (error) {
    next(error)
  }
}

/* ADD AGENT --------------------------------------------------*/
export const addAgentController = async (req, res, next) => {
  const { name, email, phone } = req.body
  const userId = req.user

  try {
    const admin = await User.findById(userId)
    if(!admin){
     return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      }) 
    }


    /* ----- CHECK AUTH ----- */
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    /* ----- VALIDATION ----- */
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    /* ----- CHECK EXISTING AGENT ----- */
    const existingAgent = await User.findOne({
      email,
    })

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent already exists',
      })
    }

    /* ----- FIND THE USER(ADMIN) ORGANIZATION ----- */
    const organization = await Organization.findById({
      _id: admin.organizationId
    })

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Orgaization not found',
      })
    }

    /* ----- GENERATE EMPLOYEE ID ----- */
    const employeeId = generateEmployeeId()

    /* ----- GENERATE  PASSWORD ----- */
    const agentPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(
      agentPassword,
      10
    )

    /* ----- CREATE AGENT ----- */
    const agent = new User({
      name,
      email,
      phone,
      role: 'agent',
      employeeId,
      password: hashedPassword,
      createdBy: req.user._id,
      organizationId: organization._id
    })

    await agent.save()

    await sendWelcomeEmail(
      agent.name,
      agent.email,
      employeeId,
      agentPassword,
    )

    res.status(201).json({
      success: true,
      message: 'Agent added successfully',
      login:{
        employeeId,
        agentPassword,
      }
    })
  } catch (err) {
    next(err)
  }
}

 /* GET EACH AGENT --------------------------------------------------*/
export const getAgentController = async (req, res, next ) => {
  const { id } = req.params

  try {
    const agent = await User.findOne({
      _id: id,
      role: 'agent',
    }).select('-password').populate('debtId')

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      })
    }

    const debtors = await User.find({
      assignedAgent: agent._id
    }).populate('debtId', 'amount status amountPaid')

    res.status(200).json({
      success: true,
      agent,
      debtors
    })

  } catch (error) {
    next(error)
  }
}

/* DELETE AGENT --------------------------------------------------*/
export const deleteAgentController = async (req, res, next) => {
  const { id } = req.params

  try {
    const agent = await User.findOne({
      _id: id,
      role: 'agent',
    })

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      })
    }

    // SOFT DELETE
    agent.isActive = false

    await agent.save()

    res.status(200).json({
      success: true,
      message: 'Agent deactivated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/* UPDATE AGENT --------------------------------------------------*/
export const updateAgentController = async (req, res, next) => {
  const { id } = req.params

  const {
    name,
    email,
    phone,
    isActive,
  } = req.body

  try {
    // FIND AGENT
    const agent = await User.findOne({
      _id: id,
      role: 'agent',
    })

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      })
    }

    // CHECK EMAIL CONFLICT
    if (email && email !== agent.email) {
      const existingEmail = await User.findOne({
        email,
      })

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        })
      }
    }

    // UPDATE FIELDS
    if (name) agent.name = name

    if (email) agent.email = email

    if (phone) agent.phone = phone

    if (typeof isActive === 'boolean') {
      agent.isActive = isActive
    }

    // SAVE
    await agent.save()

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent,
    })
  } catch (error) {
    next(error)
  }
}

/* --------------------------- DEBTOR CONTROLLERS ---------------------------*/

/* GET ALL DEBTORS --------------------------------------------------*/
export const getAllDebtorsController = async (req, res, next ) => {
  try {
    const { q, page, limit, isActive } = req.query

    const filter = {
      role: 'debtor',
    }

    // SEARCH
    if (q) {
      filter.name = {
        $regex: q,
        $options: 'i',
      }
    }

    // ACTIVE FILTER
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    // PAGINATION
    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || 10
    const skip =
      (pageNumber - 1) * limitNumber

    const debtors = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })

    const total =
      await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: debtors,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(
          total / limitNumber
        ),
        limit: limitNumber,
      },
    })
  } catch (error) {
    next(error)
  }
}

/* ADD DEBTOR + INITIAL DEBT ------------------------------------*/
export const addDebtorController = async (req, res, next ) => {
  const {
    name,
    email,
    phone,
    idNumber,
    primaryLender,
    amount,
    dueDate,
    description,
    agentId,
    status
  } = req.body 

  const userId = req.user._id

  try {
    const admin = await User.findById({_id: userId})
    if(!admin && req.user.role !== 'admin'){
     return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      }) 
    }

    /* 1. ----- VALIDATION ----- */
    if (!name || !email || !idNumber || !amount) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, ID number and amount required',
      })
    }

    /* 2. ----- CHECK EXISTING USER ----- */
    const existingUser = await User.findOne({
      email,  
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Debtor already exists',
      })
    }

    /* 3. ----- GENERATE DEBTOR CREDENTIALS ----- */
    const refNumber = generateRefNumber()

    /* 4. ----- HASH THE ID NUMBER ----- */
    const hashedPassword = await bcrypt.hash(
      idNumber,
      10
    )

    /* ----- FIND THE USER(ADMIN) ORGANIZATION ----- */
    const organization = await Organization.findById({
      _id: admin.organizationId
    })

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Orgaization not found',
      })
    }

    /* 5. ----- CREATE DEBTOR USER ----- */
    const debtor = await User.create({
      name,
      email,
      phone,
      idNumber,
      refNumber,
      role: 'debtor',
      createdBy: req.user._id,
      assignedAgent: agentId,
      organizationId: organization._id
    })

    /* 6. ----- CREATE DEBT RECORD ----- */
    const debt = await Debt.create({
      debtorId: debtor._id,
      agentId: agentId || req.user._id,
      primaryLender,
      amount,
      amountPaid: 0,
      balance: amount,
      dueDate,
      description,
      status,
      organizationId: organization._id
    })

    debtor.debtId = debt._id
    await debtor.save()

    const agent = await User.findById({_id: agentId})

    if (!agent) {
      return res.status(400).json({
        success: false,
        message: 'Agent not found',
      })
    }

    /* 7. ----- SEND DEBT ALERT ----- */
    await sendDebtorAlert(
      debtor.email,
      debtor.name,
      debtor.refNumber,
      debtor.idNumber,
      debt.amount,
      debt.balance,
      debt.dueDate,
      agent.name,
      debt.primaryLender,
    )

    /* 8. ----- RESPONSE ----- */
    res.status(201).json({
      success: true,
      message: 'Debtor and initial debt created successfully',
      debtor,
      debt,
    })
  } catch (error) {
    next(error)
  }
}

 /* GET EACH DEBTOR --------------------------------------------------*/
export const getDebtorController = async (
  req,
  res,
  next
) => {
  const { id } = req.params

  try {
    const debtor = await User.findOne({
      _id: id,
      role: 'debtor',
    }).select('-password').populate('debtId').populate('organizationId').populate("assignedAgent")

    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found',
      })
    }

    res.status(200).json({
      success: true,
      debtor,
    })
  } catch (error) {
    next(error)
  }
}

/* DELETE DEBTOR --------------------------------------------------*/
export const deleteDebtorController = async (
  req,
  res,
  next
) => {
  const { id } = req.params

  try {
    const debtor = await User.findOne({
      _id: id,
      role: 'debtor',
    })

    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found',
      })
    }

    debtor.isActive = false

    await debtor.save()

    res.status(200).json({
      success: true,
      message: 'Debtor deactivated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/* UPDATE DEBTOR --------------------------------------------------*/
export const updateDebtorController = async (
  req,
  res,
  next
) => {
  const { id } = req.params

  const {
    name,
    email,
    phone,
    idNumber,
    isActive,
  } = req.body

  try {
    const debtor = await User.findOne({
      _id: id,
      role: 'debtor',
    })

    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found',
      })
    }

    // EMAIL CHECK
    if (email && email !== debtor.email) {
      const exists = await User.findOne({
        email,
      })

      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        })
      }
    }

    if (name) debtor.name = name
    if (email) debtor.email = email
    if (phone) debtor.phone = phone
    if (idNumber) debtor.idNumber = idNumber

    if (typeof isActive === 'boolean') {
      debtor.isActive = isActive
    }

    await debtor.save()

    res.status(200).json({
      success: true,
      message: 'Debtor updated successfully',
      debtor,
    })
  } catch (error) {
    next(error)
  }
}





















// /* GET ALL AGENTS --------------------------------------------------*/
// export const getAllAgentsController = async (req, res, next) => {
//   try {
//     const { q, page, limit, isActive } = req.query

//     // FILTER OBJECT
//     const filter = {
//       role: 'agent',
//     }

//     // SEARCH
//     if (q) {
//       filter.name = {
//         $regex: q,
//         $options: 'i',
//       }
//     }

//     // ACTIVE FILTER
//     if (isActive !== undefined) {
//       filter.isActive = isActive === 'true'
//     }

//     // PAGINATION
//     const pageNumber = parseInt(page) || 1
//     const limitNumber = parseInt(limit) || 10

//     const skip =
//       (pageNumber - 1) * limitNumber

//     // QUERY
//     const agents = await User.find(filter)
//       .select('-password')
//       .skip(skip)
//       .limit(limitNumber)
//       .sort({ createdAt: -1 })

//     // TOTAL COUNT
//     const totalAgents =
//       await User.countDocuments(filter)

//     res.status(200).json({
//       success: true,

//       data: agents,

//       pagination: {
//         total: totalAgents,
//         page: pageNumber,
//         pages: Math.ceil(
//           totalAgents / limitNumber
//         ),
//         limit: limitNumber,
//       },
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* ADD AGENT --------------------------------------------------*/
// export const addAgentController = async (req, res, next) => {
//   const { name, email, phone } = req.body

//   try {
//     /* ----- CHECK AUTH ----- */
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized access',
//       })
//     }

//     /* ----- VALIDATION ----- */
//     if (!name || !email || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required',
//       })
//     }

//     /* ----- CHECK EXISTING AGENT ----- */
//     const existingAgent = await User.findOne({
//       email,
//     })

//     if (existingAgent) {
//       return res.status(400).json({
//         success: false,
//         message: 'Agent already exists',
//       })
//     }

//     /* ----- GENERATE EMPLOYEE ID ----- */
//     const employeeId = generateEmployeeId()

//     /* ----- GENERATE  PASSWORD ----- */
//     const agentPassword = generatePassword()
//     const hashedPassword = await bcrypt.hash(
//       agentPassword,
//       10
//     )

//     /* ----- CREATE AGENT ----- */
//     const agent = new User({
//       name,
//       email,
//       phone,
//       role: 'agent',
//       employeeId,
//       password: hashedPassword,
//       createdBy: req.user._id,
//     })

//     await agent.save()

//     await sendWelcomeEmail(
//       agent.name,
//       agent.email,
//       employeeId,
//       agentPassword
//     )

//     res.status(201).json({
//       success: true,
//       message: 'Agent added successfully'
//     })
//   } catch (err) {
//     next(err)
//   }
// }















// /* GET OVERVIEW DATA --------------------------------------------------*/
// export const getBalanceController = async (req, res, next) => {
//    try {
//       const debtors = await User.find({ role: "debtor" })
//       const agents = await User.find({ role: "agent" })
//       const debts = await Debt.find()

//       const totalOwed = debtors.reduce((sum, debtor) => {
//          return sum + (debtor.balance || 0)
//       }, 0)

//       const totalAgents = await User.countDocuments({ role: "agent", isActive: true })
//       const totalDebtors = await User.countDocuments({ role: "debtor", isActive: true })
//       const totalDebts = await Debt.countDocuments()

//       res.status(200).json({
//          success: true,
//          message: "Total Balances",
//          debtors,
//          agents,
//          debts,
//          totalDebts,
//          totalOwed,
//          totalAgents,
//          totalDebtors,
//       })

//    } catch (error) {
//       next(error)
//    }
// }

// /* SEED ADMIN --------------------------------------------------*/
// export const createAdminController = async (req, res, next) => {
//    const { fullName, email, phoneNumber } = req.body
//    try {
//       const existingAdmin = await User.findOne({ role: "admin" })
//       if (existingAdmin) {
//          return res.status(400).json({
//             success: false,
//             message: "Admin already exists"
//          })
//       }

//       const accessId = `DH${generateAccessId()}`
//       const password = `DH${generatePassword()}`

//       const hashedPassword = await bcrypt.hash(password, 10)

//       const admin = await User.create({
//          fullName,
//          email,
//          phoneNumber,
//          password:hashedPassword,
//          role: "admin",
//          accessId,
//          /* --- undefined fields for admin --- */
//          status: undefined,
//          balance: undefined,
//          refNumber: undefined,
//          agentName:undefined,
//          assignedDebtors:undefined,
//          notes:undefined
//       })

//       res.status(200).json({
//          success: true,
//          message: 'Admin added successfully',
//          admin,
//          detials:{
//             accessId,
//             password
//          }
//       })
//    }catch(error){
//       next(error)
//    }
// }

// /* -------------------------------------------------------------------------------*/
// /*                              AGENT CONTROLLERS                                 */
// /* -------------------------------------------------------------------------------*/

// /* ADD AGENT --------------------------------------------------*/
// export const addAgentController = async (req, res, next) => {
//    const { fullName, email, phoneNumber } = req.body
//    const userId = req.userId
//    try {
//       const admin = await User.findById({
//          _id: userId,
//          role: 'admin'
//       })

//       if(!admin){
//        return res.status(400).json({
//             success: false,
//             message: "Unauthorised Access"
//          })  
//       }

//       if (!fullName || !email || !phoneNumber) {
//          return res.status(400).json({
//             success: false,
//             message: "All fields are required"
//          })
//       }

//       const existingUser = await User.findOne({ email })
//       if (existingUser) {
//          return res.status(400).json({
//             success: false,
//             message: "Email already exists"
//          })
//       }

//       const agentPassword = `DH${generatePassword()}`
//       const hashedPassword = await bcrypt.hash(agentPassword, 10)

//       const user = new User({
//          fullName,
//          email,
//          phoneNumber,
//          role: "agent",
//          balance: undefined,
//          accessId: `DH${generateAccessId()}`,
//          password: hashedPassword
//       })

//       await user.save()

//       await sendWelcomeEmail(user.fullName, user.email, user.accessId, agentPassword)

//       res.status(201).json({
//          success: true,
//          message: "Agent added successfully",
//          user: {...user, password:undefined}
//       })

//    } catch (err) {
//       next(err)
//    }
// }



//  /* GET EACH AGENT --------------------------------------------------*/
// export const getAgentController = async (
//   req,
//   res,
//   next
// ) => {
//   const { id } = req.params

//   try {
//     const agent = await User.findOne({
//       _id: id,
//       role: 'agent',
//     }).select('-password')

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Agent not found',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       agent,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* DELETE AGENT --------------------------------------------------*/
// export const deleteAgentController = async(req, res, next) => {
//     const { id } = req.params
//    try{
//       const deletedAgent = await User.findOneAndDelete({ 
//          _id: id,
//          role: "agent" 
//       })

//       if(!deletedAgent){
//          return res.status(404).json({
//             success:false,
//             message: "Agent not found"
//          })
//       }

//       res.status(200).json({
//          success: true,
//          message: "Agent deleted successfully"
//       })
//    }catch(error){
//       next(error)
//    }
// }

// /* -------------------------------------------------------------------------------*/
// /*                              DEBTORS CONTROLLERS                                 */
// /* -------------------------------------------------------------------------------*/

// /* ADD DEBTOR --------------------------------------------------*/
// export const addDebtorController = async (req, res, next) => {
//    const { fullName, 
//            email, 
//            phoneNumber, 
//            idNumber,
//            balance, 
//            primaryLender, 
//            agentId,
//            status
//    } = req.body

//    const userId = req.userId

//    try {
//       if (!fullName || !email || !phoneNumber || !idNumber || !primaryLender || !balance) {
//          return res.status(400).json({
//             success: false,
//             message: "All required fields must be provided"
//          })
//       }

//       const existingDebtor = await User.findOne({ idNumber })
//       if (existingDebtor) {
//          return res.status(400).json({
//             success: false,
//             message: "Debtor already exists"
//          })
//       }

//       const existingEmail = await User.findOne({ email })
//       if (existingEmail) {
//          return res.status(400).json({
//             success: false,
//             message: "Email already exists"
//          })
//       }

//       const agent = await User.findById(agentId)
//       const agentFullName = agent ? agent.fullName : undefined

//       const user = new User({
//          fullName,
//          email,
//          phoneNumber,
//          idNumber,
//          assignedAgent: agentId,
//          agentName: agentFullName,
//          refNumber: `REF${generateRefNumber()}`,
//          balance: balance ||  0,
//          role: "debtor",
//          status,
//       })

//       const updatedList = await User.findOneAndUpdate(
//          { _id: agentId },
//          {
//             $push: { assignedDebtors: user._id}
//          },
//          {
//           new: true,
//           runValidators: true
//          }
//       )
//       await agent.save()

      

//       const debt = new Debt({
//          debtorInfo:{
//             debtor: user._id,
//             fullName: user.fullName,
//             refNumber: user.refNumber,
//             idNumber: user.idNumber
//          },
//          primaryLender,
//          agent:{
//             agentId: agentId
//          },
//          amount: balance || 0,
//          balance: balance || 0,
//          description: "Initial balance",
//       })

//       await debt.save()
//       await user.save()
//       const admin = await User.findOne({ role:"admin" })


//       const notification = new Notification({
//          recipient: admin._id,
//          type:"debtor_added",
//          message: `New debtor added: ${user.fullName} with balance of R ${balance || 0}`,
//          relatedDebtor: user._id
//       })

//       await notification.save()
      
//       res.status(201).json({
//          success: true,
//          message: "Debtor added successfully",
//          user
//       })

//    } catch (err) {
//       next(err)
//    }
// }

// /* GET ALL DEBTORS --------------------------------------------------*/
// export const getAllDebtorsController = async (req, res, next) => {
//    const userId = req.userId
//    try {
//       let debtors;
//       if(req.userRole === 'admin'){
//          debtors = await User.find({
//             role: 'debtor'
//          })
//       }else if(req.userRole === 'agent'){
//          debtors = await User.find({
//             role: 'debtor',
//             assignedAgent: userId
//          })
//       }else{
//          return res.status(400).json({
//             success: false,
//             message: "Debtors not found"
//          })
//       }

//       res.status(200).json({
//          success: true,
//          count: debtors.length,
//          debtors
//       })

//    } catch (error) {
//       next(error)
//    }
// }

// /* GET EACH DEBTOR --------------------------------------------------*/
// export const getDebtorController = async(req, res, next) => {
//    const { id } = req.params
//    try{
//       const debtor = await  User.findById(id)
//       if(!debtor){
//          return res.status(400).json({
//             success: false,
//             message: "Debtor not found"
//          })
//       }

//       res.status(200).json({
//          success:true,
//          debtor
//       })
//    }catch(error){
//       next(error)
//    }
// }

// /* DELETE DEBTOR --------------------------------------------------*/
// export const deleteDebtorController = async(req, res, next)=>{
//    const { id } = req.params
//    try{
//       const deletedDebtor = await User.findOneAndDelete({ 
//          _id: id,
//          role: "debtor" 
//       })

//       if(!deletedDebtor){
//          return res.status(404).json({
//             success:false,
//             message: "Debtor not found"
//          })
//       }

//       res.status(200).json({
//          success: true,
//          message: "Debtor deleted successfully"
//       })
//    }catch(error){
//       next(error)
//    }
// }

/* -------------------------------------------------------------------------------*/
/*                         DEBTS CONTROLLER(ROLE-BASED)                           */
/* -------------------------------------------------------------------------------*/






/* GET DEBTS  --------------------------------------------------*/
export const  getDebtsController = async (req, res, next) => {
   const userId = req.userId
   try {

     let debts;
     if(req.userRole === 'admin'){
        debts = await Debt.find()
     } else if(req.userRole === 'agent'){
        debts = await Debt.find({ agent: {
         agentId: userId
        } }) 
     } else if(req.userRole === 'debtor'){
        debts = await Debt.find({ debtorInfo:{
         debtor: userId
        } })
     }else{
      return res.status(403).json({
         success: false,
         message: "Unauthorized access"
      })
     }

     res.status(200).json({
      success: true,
      count: debts.length,
      debts
     })

   } catch (error) {
      next(error)
   }
}

/* GET EACH DEBT  --------------------------------------------------*/

/* UPDATE DEBT  --------------------------------------------------*/

/* DELETE DEBT  --------------------------------------------------*/






/* GET INSTALLMENTS --------------------------------------------------*/
export const getActiveInstallments = async (req, res, next) => {
  const userId = req.userId
  try {
    let installments;
    if(req.userRole === 'admin'){
      installments = await Installments.find()
    }else if(req.userRole === 'agent'){
      installments = await Installments.find({
         createdBy: userId,
      })
    }else if(req.userRole === 'debtor'){
      installments = await Installments.find({
         relatedDebtor: userId
      })
    }else{
      return res.status(400).json({
         success: false,
         message: 'Installment not found'
      })
    }

    res.status(200).json({
      success: true,
      installments
    })

  } catch (error) {
    next(error)
  }
}

/* CREATE INSTALLMENTS --------------------------------------------------*/
export const createInstallments = async (req, res, next) => {
  const userId = req.userId;

  const {
    debtorId,
    originalBalance,
    installmentAmount,
    frequency,
    totalInstallments,
    nextDueDate,
    startDate,
    status
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised Access"
      });
    }

    const debtor = await User.findById(debtorId);
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: "Debtor not found"
      });
    }

    const existingInstallment = await Installments.findOne({
      relatedDebtor: debtorId,
      status: "active"
    });

    if (existingInstallment) {
      return res.status(400).json({
        success: false,
        message: "Active installment already exists for this debtor"
      });
    }

    const installment = new Installments({
      relatedDebtor: debtor._id,
      createdBy: user._id,
      originalBalance,
      remainingBalance:originalBalance,
      installmentAmount,
      frequency,
      totalInstallments,
      nextDueDate,
      startDate,
      status
    });

    await installment.save();

    await sendInstallmentCreatedEmail(
      debtor.fullName,
      debtor.email,
      installmentAmount,
      frequency,
      totalInstallments,
      nextDueDate,
      startDate
    );

    const admin = await User.findOne({
      role:"admin",
      isActive: true
   })

    await Notification.create({
      recipient: admin._id,
      type: "installment_plan",
      message: `A new installment plan of R${installmentAmount} was created.`
    });

    return res.status(201).json({
      success: true,
      message: "Installment plan created",
      installment
    });

  } catch (error) {
    next(error);
  }
};

/* GET PAYMENTS --------------------------------------------------*/
export const getAllPayments = async(req, res, next)=>{
   const userId = req.userId 
   try{
     let payments;
     if(req.userRole === "admin"){
      payments = await Payment.find()
     }else if(req.userRole === 'agent'){
      payments = await Payment.find({
         agent: userId
      })
     }else if(req.userRole === 'debtor'){
      payments = await Payment.find({
         debtor: userId
      })
     }else{
      return res.status(400).json({
         success: false,
         message: "Payments not found"
      })
     }

     res.status(200).json({
      success: true,
      payments
     })
   }catch(error){
      next(error)
   }
}

/* -------------------------------------------------------------------------------*/
/*                   NOTIFICATION CONTROLLER(ROLE-BASED)                         */
/* -------------------------------------------------------------------------------*/

/* GET NOTIFICATIONS --------------------------------------------------*/
export const getNotificationsController = async (req, res, next) => {
   const userId = req.userId
   try {
      const notifications = await Notification.find({
         recipient: userId,
         read: false
      }).sort({ createdAt: -1 })

      res.status(200).json({
         success: true,
         notifications, 
         count: notifications.length,
         message: notifications.length === 0 ? "You're all caught up" : undefined
      })

   } catch (error) {
      next(error)
   }
}

/* MARK NOTIFICATION AS READ --------------------------------------------------*/
export const readNotificationsController = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params
    const userId = req.userId

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: id,
          recipient: userId
        },
        {
          $set: {
            read: true
          }
        },
        {
          new: true,
          runValidators: true
        }
      )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.status(200).json({
      success: true,
      notification
    })

  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------------------------------------*/
/*                       TICKET CONTROLLER(ROLE-BASED)                            */
/* -------------------------------------------------------------------------------*/

/* ADD TICKET --------------------------------------------------*/
export const addTicketController = async (req, res, next) => {

  try {

    const userId = req.userId

    const {
      subject,
      priority,
      description
    } = req.body

    const agent = await User.findById(userId)

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      })
    }

    const admin = await User.findOne({
      role: 'admin',
      isActive: true
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No active admin found'
      })
    }

    const ticketNumber =
      `TKT-${Date.now()}`

    const firstMessage = {
      sender: {
        userId: agent._id,
        name: agent.fullName,
        role: agent.role
      },
      message: description,
      createdAt: new Date()
    }

    const newTicket = await Ticket.create({
      ticketNumber,

      submittedBy: {
        agentId: agent._id,
        fullName: agent.fullName,
        email: agent.email,
        phoneNumber: agent.phoneNumber
      },

      subject,
      priority,
      description,

      assignedTo: admin._id,

      attachments: req.file?.path || null,

      messages: [firstMessage]
    })

    await Notification.create({
      recipient: admin._id,
      type: 'new_ticket',
      message: `New support ticket: ${ticketNumber}`
    })

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      newTicket
    })

  } catch (error) {
    next(error)
  }
}

/* GET ALL TICKETS --------------------------------------------------*/
export const getTicketsController = async (req, res, next)=>{
   const userId = req.userId

   try{
      let tickets;
      const admin = await User.findOne({
         role:'admin',
         isActive:true
      })

      const agent = await User.findOne({
         _id: userId
      })
      if(admin){
         tickets = await Ticket.find({}).sort({createdAt: -1})
      } 
 
      if(req.userRole === 'agent'){
         tickets = await Ticket.find({
            submittedBy:{
               agentId: agent._id
            }
         })
      }
      

      res.status(200).json({
         success: true,
         tickets
      })
   }catch(err){
      next(err)
   }
}

/* GET EACH TICKETS --------------------------------------------------*/
export const getEachTicketController = async (req, res, next) => {
   const { Id } = req.params
   try {
      const ticket = await Ticket.findById(id)
      if (!ticket) {
         return res.status(400).json({
            success: false,
            message:"No ticket found"
         })
      }

      res.status(200).json({
         success:true,
         message:"Ticket found!",
         ticket
      })
   } catch (error) {
      next(error)
   }
}

/* REPLY TICKETS --------------------------------------------------*/
export const replyticketController = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params
    const userId = req.userId

    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const ticket = await Ticket.findById(id)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    const newMessage = {
      sender: {
        userId: user._id,
        name: user.fullName,
        role: user.role
      },

      message,

      createdAt: new Date()
    }

    const newStatus =
      user.role === 'admin'
        ? 'in_progress'
        : 'open'

    const updatedTicket =
      await Ticket.findByIdAndUpdate(
        id,
        {
          $push: {
            messages: newMessage
          },

          $set: {
            status: newStatus
          }
        },
        
      )

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      updatedTicket
    })

  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------------------------------------*/
/*                       INTERACTION CONTROLLER(ROLE-BASED)                       */
/* -------------------------------------------------------------------------------*/

/* RECORD INTERACTION --------------------------------------------------*/
export const recordInteractions = async(req,res, next)=>{
   const userId = req.userId
   const { id } = req.params
   const { notes, method, date, outcome } = req.body
   try{
      const agent = await User.findOne({
         assignedDebtors: id
      })

      if(!agent){
         return res.status(200).json({
            success: false,
            message:"Agent not found" 
         })
      }

      const debtor = await User.findById(id)
      if(!debtor){
         return res.status(200).json({
            success: false,
            message:"debtor not found"
         })
      }

      const interaction = new Interaction({
         relatedDebtor: debtor._id,
         relatedAgent: agent._id,
         method,
         notes,
         date,
         outcome
      })

      await interaction.save()

      const admin = await User.findOne({role:"admin", isActive: true})
      //Notification to admin
      await Notification.create({
         recipient: admin._id,
         type: "interaction_made",
         message: `Interaction between ${agent.fullName} and ${debtor.fullName} via ${method} - Here are the notes ${notes}`,
         relatedDebtor: debtor._id
      })

      res.status(200).json({ 
         success: true,
         interaction
      })

   }catch(err){
      next(err)
   }
}

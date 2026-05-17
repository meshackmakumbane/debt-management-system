import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
{
  system: {
    appName: { type: String, default: "Debt Hero - Debt Management System" },
    logo: { type: String }, // URL
    currency: { type: String, default: "ZAR" },
    timezone: { type: String, default: "Africa/Johannesburg" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    language: { type: String, default: "en" },
    paginationLimit: { type: Number, default: 10 }
 
  },

  userRoles: [
    {
      name: { type: String, required: true }, // Admin, Agent, Debtor
      permissions: {
        viewDebts: { type: Boolean, default: true },
        createDebts: { type: Boolean, default: false },
        editDebts: { type: Boolean, default: false },
        deleteDebts: { type: Boolean, default: false },
        manageUsers: { type: Boolean, default: false },
        approvePayments: { type: Boolean, default: false }
      }
    }
  ],

  debtSettings: {
    defaultInterestRate: { type: Number, default: 0 }, // %
    interestType: {
      type: String,
      enum: ["fixed", "reducing"],
      default: "fixed"
    },
    latePenalty: {
      type: Number,
      default: 0
    },
    penaltyType: {
      type: String,
      enum: ["flat", "percentage"],
      default: "flat"
    },
    gracePeriodDays: { type: Number, default: 3 },
    minInstallmentAmount: { type: Number, default: 100 },
    maxRepaymentDurationMonths: { type: Number, default: 12 },
    autoCalculateInstallments: { type: Boolean, default: true }
  },

  paymentSettings: {
    paymentMethods: [
      {
        type: String,
        enum: ["cash", "bank_transfer", "mobile_money"]
      }
    ],
    allocationStrategy: {
      type: String,
      enum: ["oldest_first", "manual"],
      default: "oldest_first"
    },
    allowPartialPayments: { type: Boolean, default: true },
    autoMarkAsPaid: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false }
  },

  notificationSettings: {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },

    reminders: {
      beforeDueDays: { type: Number, default: 2 },
      afterDueDays: { type: Number, default: 1 }
    },

    templates: {
      beforeDue: { type: String },
      overdue: { type: String }
    }
  },

  securitySettings: {
    enable2FA: { type: Boolean, default: false },
    maxLoginAttempts: { type: Number, default: 5 },
    sessionTimeoutMinutes: { type: Number, default: 60 },
    enableAuditLogs: { type: Boolean, default: true }
  },

  automationRules: {
    autoAssignDebts: { type: Boolean, default: false },
    autoApplyPenalty: { type: Boolean, default: true },
    autoCloseDebt: { type: Boolean, default: true }
  },

  uiSettings: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    },
    defaultDashboard: {
      type: String,
      enum: ["admin", "agent", "debtor"],
      default: "admin"
    }
  }
},
{ timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
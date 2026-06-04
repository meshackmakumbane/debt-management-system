/* VERIFICATION EMAIL (ORGANIZATION VERIFICATION) ------------------------------------ */
export const VerificationEmail = (name, code) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Verify your email</h2>

    <p>Hi ${name},</p>

    <p>Your verification code is:</p>

    <h1 style="letter-spacing:4px">${code}</h1>

    <p>This code expires in 10 minutes.</p>
  </div>
`

/* WELCOME EMAIL (UPON VERIFIED) ------------------------------------ */
export const WelcomeEmail = (name, loginUrl) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Welcome to Debt Hero 🎉</h2>

    <p>Hi ${name}, your account is now active.</p>

    <a href="${loginUrl}" style="
      display:inline-block;
      padding:10px 20px;
      background:#16a34a;
      color:#fff;
      text-decoration:none;
      border-radius:6px;
    ">
      Go to Login
    </a>
  </div>
`

/* AGENT WELCOME EMAIL (UPON VERIFIED) ------------------------------------ */
export const agentWelcomeEmail = (
  name,
  organizationName,
  employeeId,
  password
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to ${organizationName}</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <div style="max-width:600px; margin:30px auto; background:#ffffff; padding:24px; border-radius:10px;">

    <h2 style="color:#222;">Welcome, ${name}</h2>

    <p style="font-size:14px; color:#555; line-height:1.5;">
      You have been successfully added as an <strong>Agent</strong> to
      <strong>${organizationName}</strong> on the Debt Hero platform.
    </p>

    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

    <h3 style="color:#222;">Your Login Details</h3>

    <p style="font-size:14px; color:#555; line-height:1.6;">
      <strong>Access ID:</strong> ${employeeId}<br/>
      <strong>Password:</strong> ${password}
    </p>

    <p style="font-size:12px; color:#888; margin-top:10px;">
      Please keep your login details secure. Do not share them with anyone.
    </p>

    <div style="margin-top:25px; text-align:center;">
      <a href="https://your-app-login-url.com"
         style="background:#16a34a; color:#fff; padding:12px 22px; text-decoration:none; border-radius:6px; display:inline-block;">
        Login Now
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">

    <p style="font-size:11px; color:#aaa; text-align:center;">
      © ${new Date().getFullYear()} Debt Hero · All rights reserved
    </p>

  </div>

</body>
</html>
`

/* INSTALLMENT CREATED EMAIL ------------------------------------ */
export const installmentCreated = (
  name,
  installmentAmount,
  frequency,
  totalInstallments,
  nextDueDate,
  startDate,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Installment Plan Created</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <div style="max-width:600px; margin:30px auto; background:#ffffff; padding:20px; border-radius:8px;">

    <h2 style="color:#333;">Hello ${name},</h2>

    <p style="font-size:14px; color:#555;">
      Your installment plan has been successfully created on the Debt Management System.
    </p>

    <hr style="border:none; border-top:1px solid #eee;">

    <h3 style="color:#333;">Installment Details</h3>

    <p style="font-size:14px; color:#555; line-height:1.6;">
      <strong>Installment Amount:</strong> ${installmentAmount}<br/>
      <strong>Frequency:</strong> ${frequency}<br/>
      <strong>Total Installments:</strong> ${totalInstallments}<br/>
      <strong>Start Date:</strong> ${startDate}<br/>
      <strong>Next Due Date:</strong> ${nextDueDate}
    </p>

    <p style="font-size:13px; color:#888;">
      Please ensure payments are made on or before the due dates to avoid penalties.
    </p>

    <div style="margin-top:20px; text-align:center;">
      <a href="https://your-app-url.com/debtor/dashboard"
         style="background:#228b22; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">
        View Payment Plan
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin-top:20px;">

    <p style="font-size:12px; color:#aaa; text-align:center;">
      © ${new Date().getFullYear()} Debt Hero. All rights reserved.
    </p>

  </div>

</body>
</html>
`;


export const debtorDebtAlertTemplate = ({
  name,
  refNumber,
  idNumber,
  amount,
  balance,
  dueDate,
  agentName,
  primaryLender,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px; border-radius:10px;">

      <h2 style="color:#1a1a1a;">Debt Collection Notice</h2>

      <p>Dear <strong>${name}</strong>,</p>

      <p>
        This is an official notification regarding your account on the <strong>Debt Hero</strong>.
        Please find your account details below.
      </p>

      <hr />

      <h3 style="color:#333;">Account Information</h3>

      <p><strong>Reference Number:</strong> ${refNumber}</p>
      <p><strong>ID Number:</strong> ${idNumber}</p>
      <p><strong>Assigned Agent:</strong> ${agentName}</p>
      <p><strong>Primary Lender:</strong> ${primaryLender}</p>

      <hr />

      <h3 style="color:#333;">Debt Summary</h3>

      <p><strong>Total Amount:</strong> R ${amount}</p>
      <p><strong>Amount Paid:</strong> R ${amount - balance}</p>
      <p><strong>Outstanding Balance:</strong> <span style="color:red;">R ${balance}</span></p>
      <p><strong>Due Date:</strong> ${new Date(
        dueDate
      ).toLocaleDateString()}</p>

      <hr />

      <p style="color:#555;">
        Please ensure payments are made on or before the due date to avoid penalties or further action.
      </p>

      <p style="color:#555;">
        If you have already made a payment, kindly ignore this message or contact your assigned agent.
      </p>

      <br />

      <p>Regards,<br/><strong>Debt Hero System</strong></p>

      <hr />

      <p style="font-size:12px; color:#999;">
        This is an automated message. Please do not reply directly to this email.
      </p>

    </div>
  `
}
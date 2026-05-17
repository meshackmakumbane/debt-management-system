export const agentWelcomeEmail = (fullName, accessId, password) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Debt Hero</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <div style="max-width:600px; margin:30px auto; background:#ffffff; padding:20px; border-radius:8px;">

    <h2 style="color:#333;">Welcome, ${fullName}</h2>

    <p style="font-size:14px; color:#555;">
      You have been successfully added as an <strong>Agent</strong> on the Debt Management System.
    </p>

    <hr style="border:none; border-top:1px solid #eee;">

    <h3 style="color:#333;">Your Login Details</h3>

    <p style="font-size:14px; color:#555;">
      <strong>Access ID:</strong> ${accessId}<br/>
      <strong>Password:</strong> ${password}
    </p>

    <p style="font-size:13px; color:#888;">
      Please keep the access ID and password safely, do not share them with anyone.
    </p>

    <div style="margin-top:20px; text-align:center;">
      <a href="https://your-app-login-url.com"
         style="background:#2563eb; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">
        Login Now
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin-top:20px;">

    <p style="font-size:12px; color:#aaa; text-align:center;">
      © ${new Date().getFullYear()} Debt Hero. All rights reserved.
    </p>

  </div>

</body>
</html>
`
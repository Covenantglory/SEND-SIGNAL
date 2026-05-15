import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Roboto', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="400" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <span style="font-size: 22px; font-weight: 600; color: #191919;">Send Signal</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <p style="font-size: 14px; color: #666666; margin: 0; line-height: 1.5;">
                    Click the button below to reset your password.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <a href="${resetUrl}" style="display: inline-block; background-color: #0583f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    Reset Password
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    This link expires in 1 hour. If you didn't request this, ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Send Signal <noreply@sendsignal.com>',
    to,
    subject: 'Reset your password',
    html,
  });
}

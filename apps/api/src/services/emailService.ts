import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@guardianrs.com';
const FROM_NAME = process.env.FROM_NAME || 'GuardianRS';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0f0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#1a1a24;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;border:1px solid #2a2a3a;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">⚔️ GuardianRS</h1>
          <p style="color:#c4b5fd;margin:5px 0 0;font-size:14px;">Premium OSRS Boosting Services</p>
        </div>
        <!-- Content -->
        <div style="padding:30px;color:#e2e8f0;">
          ${content}
        </div>
        <!-- Footer -->
        <div style="padding:20px 30px;background-color:#12121a;text-align:center;border-top:1px solid #2a2a3a;">
          <p style="color:#64748b;margin:0;font-size:12px;">© ${new Date().getFullYear()} GuardianRS. All rights reserved.</p>
          <p style="color:#64748b;margin:5px 0 0;font-size:12px;">This is an automated message. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyLink = `${FRONTEND_URL}/verify-email?token=${token}`;
  const html = baseTemplate(`
    <h2 style="color:#ffffff;margin:0 0 15px;font-size:22px;">Verify Your Email</h2>
    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px;">
      Welcome to GuardianRS! Please verify your email address to get started with our premium boosting services.
    </p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${verifyLink}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:16px;">
        Verify Email Address
      </a>
    </div>
    <p style="color:#94a3b8;font-size:13px;margin:0;">
      If you didn't create an account, you can safely ignore this email. This link expires in 24 hours.
    </p>
  `);

  await sendEmail(email, 'Verify Your Email - GuardianRS', html);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
  const html = baseTemplate(`
    <h2 style="color:#ffffff;margin:0 0 15px;font-size:22px;">Reset Your Password</h2>
    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px;">
      We received a request to reset your password. Click the button below to choose a new password.
    </p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:16px;">
        Reset Password
      </a>
    </div>
    <p style="color:#94a3b8;font-size:13px;margin:0;">
      If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.
    </p>
  `);

  await sendEmail(email, 'Reset Your Password - GuardianRS', html);
}

export async function sendOrderConfirmation(
  email: string,
  order: { orderNumber: string; serviceName: string; totalPrice: number; rsn: string }
): Promise<void> {
  const html = baseTemplate(`
    <h2 style="color:#ffffff;margin:0 0 15px;font-size:22px;">Order Confirmed! 🎉</h2>
    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px;">
      Thank you for your order! Here are your order details:
    </p>
    <div style="background-color:#12121a;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #2a2a3a;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#94a3b8;padding:8px 0;font-size:14px;">Order Number</td>
          <td style="color:#ffffff;padding:8px 0;font-size:14px;text-align:right;font-weight:600;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:8px 0;font-size:14px;">Service</td>
          <td style="color:#ffffff;padding:8px 0;font-size:14px;text-align:right;">${order.serviceName}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:8px 0;font-size:14px;">RSN</td>
          <td style="color:#c4b5fd;padding:8px 0;font-size:14px;text-align:right;">${order.rsn}</td>
        </tr>
        <tr style="border-top:1px solid #2a2a3a;">
          <td style="color:#94a3b8;padding:12px 0 0;font-size:16px;font-weight:600;">Total</td>
          <td style="color:#22c55e;padding:12px 0 0;font-size:16px;text-align:right;font-weight:700;">$${order.totalPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    <p style="color:#cbd5e1;line-height:1.6;margin:0;">
      Our team will begin working on your order shortly. You can track your order status in your dashboard.
    </p>
  `);

  await sendEmail(email, `Order Confirmed #${order.orderNumber} - GuardianRS`, html);
}

export async function sendOrderStatusUpdate(
  email: string,
  order: { orderNumber: string; serviceName: string },
  newStatus: string
): Promise<void> {
  const statusColors: Record<string, string> = {
    IN_PROGRESS: '#3b82f6',
    COMPLETED: '#22c55e',
    CANCELLED: '#ef4444',
    REFUNDED: '#f59e0b',
  };
  const statusColor = statusColors[newStatus] || '#7c3aed';

  const html = baseTemplate(`
    <h2 style="color:#ffffff;margin:0 0 15px;font-size:22px;">Order Status Update</h2>
    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px;">
      Your order <strong style="color:#ffffff;">#${order.orderNumber}</strong> has been updated.
    </p>
    <div style="background-color:#12121a;border-radius:8px;padding:20px;margin:20px 0;text-align:center;border:1px solid #2a2a3a;">
      <p style="color:#94a3b8;margin:0 0 8px;font-size:14px;">New Status</p>
      <span style="display:inline-block;background-color:${statusColor};color:#ffffff;padding:8px 24px;border-radius:20px;font-weight:600;font-size:14px;">
        ${newStatus.replace(/_/g, ' ')}
      </span>
      <p style="color:#94a3b8;margin:15px 0 0;font-size:14px;">Service: ${order.serviceName}</p>
    </div>
    <div style="text-align:center;margin:20px 0;">
      <a href="${FRONTEND_URL}/dashboard/orders" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;font-size:14px;">
        View Order Details
      </a>
    </div>
  `);

  await sendEmail(email, `Order #${order.orderNumber} Status Update - GuardianRS`, html);
}

export async function sendTicketReplyNotification(email: string, ticketSubject: string): Promise<void> {
  const html = baseTemplate(`
    <h2 style="color:#ffffff;margin:0 0 15px;font-size:22px;">New Reply on Your Ticket</h2>
    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px;">
      You have received a new reply on your support ticket:
    </p>
    <div style="background-color:#12121a;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #2a2a3a;">
      <p style="color:#94a3b8;margin:0 0 5px;font-size:13px;">Subject</p>
      <p style="color:#ffffff;margin:0;font-size:16px;font-weight:600;">${ticketSubject}</p>
    </div>
    <div style="text-align:center;margin:20px 0;">
      <a href="${FRONTEND_URL}/dashboard/tickets" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;font-size:14px;">
        View Ticket
      </a>
    </div>
  `);

  await sendEmail(email, `New Reply: ${ticketSubject} - GuardianRS`, html);
}

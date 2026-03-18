import * as nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Transporter
// ---------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL on port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export { transporter };

// ---------------------------------------------------------------------------
// Shared template helpers
// ---------------------------------------------------------------------------

const BRAND_GREEN = "#2D6A4F";
const BRAND_LIGHT = "#D8F3DC";
const TEXT_PRIMARY = "#1B4332";
const TEXT_SECONDARY = "#555555";
const BACKGROUND = "#F0F7F4";

function emailWrapper(content: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";
  const logoUrl = `${appUrl}/assets/logo.webp`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EarthEcho</title>
</head>
<body style="margin:0;padding:0;background-color:${BACKGROUND};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <!-- Main container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_GREEN};padding:28px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <img src="${logoUrl}" alt="EarthEcho" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:10px;" />
                  </td>
                </tr>
                <tr>
                  <td style="font-size:28px;color:#ffffff;font-weight:700;letter-spacing:1px;">
                    EarthEcho
                  </td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:${BRAND_LIGHT};padding-top:4px;letter-spacing:0.5px;">
                    Track Your Environmental Impact
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND_LIGHT};padding:20px 32px;text-align:center;border-top:1px solid #B7E4C7;">
              <p style="margin:0;font-size:13px;color:${TEXT_PRIMARY};">
                EarthEcho &mdash; Track Your Environmental Impact
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:${TEXT_SECONDARY};">
                &copy; ${new Date().getFullYear()} EarthEcho. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buttonHtml(href: string, label: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
  <tr>
    <td style="background-color:${BRAND_GREEN};border-radius:8px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.3px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// sendEmail – generic helper
// ---------------------------------------------------------------------------

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await transporter.sendMail({
    from: `"EarthEcho" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

// ---------------------------------------------------------------------------
// sendWelcomeEmail
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  name: string,
  email: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";

  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Welcome to EarthEcho, ${name}!
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We're thrilled to have you join our community of environmentally-conscious individuals
      committed to making a positive impact on the planet.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      With EarthEcho you can:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 8px;">
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Track your carbon footprint across transport, energy, shopping &amp; more</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Complete eco-challenges and earn badges</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Join the community forum and share your journey</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Climb the leaderboard and inspire others</td>
      </tr>
    </table>
    ${buttonHtml(`${appUrl}/dashboard`, "Go to Your Dashboard")}
    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">
      Every small action adds up. Let's make a difference together.
    </p>`;

  await sendEmail(
    email,
    "Welcome to EarthEcho! Let's make an impact together",
    emailWrapper(body),
  );
}

// ---------------------------------------------------------------------------
// sendPasswordResetEmail  (OWASP compliant)
// ---------------------------------------------------------------------------

export async function sendPasswordResetEmail(
  name: string,
  email: string,
  resetUrl: string,
): Promise<void> {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Password Reset Request
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Hi ${name},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We received a request to reset the password associated with your EarthEcho account.
      Click the button below to set a new password.
    </p>
    ${buttonHtml(resetUrl, "Reset Your Password")}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0 0;background-color:#FFF8E1;border-radius:8px;border:1px solid #FFE082;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#F57F17;">
            &#9888; Important Security Information
          </p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.7;color:${TEXT_SECONDARY};">
            <li>This link expires in <strong>1 hour</strong> for your security.</li>
            <li>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</li>
            <li>Never share this link with anyone. EarthEcho staff will never ask for your password.</li>
          </ul>
        </td>
      </tr>
    </table>
    <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${TEXT_SECONDARY};">
      If the button above doesn't work, copy and paste the following URL into your browser:
    </p>
    <p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:${BRAND_GREEN};word-break:break-all;">
      ${resetUrl}
    </p>`;

  await sendEmail(
    email,
    "Reset your EarthEcho password",
    emailWrapper(body),
  );
}

// ---------------------------------------------------------------------------
// sendBanNotificationEmail
// ---------------------------------------------------------------------------

export async function sendBanNotificationEmail(
  name: string,
  email: string,
  reason: string,
): Promise<void> {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Account Suspended
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Dear ${name},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We are writing to inform you that your EarthEcho account has been suspended
      following a review of your activity on the platform.
    </p>

    <!-- Reason box -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:#FFEBEE;border-radius:8px;border-left:4px solid #C62828;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#C62828;text-transform:uppercase;letter-spacing:0.5px;">
            Reason for Suspension
          </p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:${TEXT_PRIMARY};">
            ${reason}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      This decision was made in accordance with our
      <strong>Community Guidelines</strong> and <strong>Terms of Service</strong>,
      which all users agree to upon registration.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      If you believe this action was taken in error, or if you would like to
      appeal this decision, please contact our support team by replying to this
      email. We will review your case and respond within 5 business days.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:${TEXT_SECONDARY};">
      Regards,<br />
      <strong style="color:${TEXT_PRIMARY};">The EarthEcho Team</strong>
    </p>`;

  await sendEmail(
    email,
    "EarthEcho Account Suspension Notice",
    emailWrapper(body),
  );
}

// ---------------------------------------------------------------------------
// sendAdminInviteEmail
// ---------------------------------------------------------------------------

export async function sendAdminInviteEmail(
  email: string,
  tempPassword: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";

  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      You've Been Invited as an Admin
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      You have been invited to join the EarthEcho platform as an <strong>administrator</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Use the credentials below to sign in:
    </p>

    <!-- Credentials box -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:${BRAND_LIGHT};border-radius:8px;border:1px solid #B7E4C7;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;color:${TEXT_SECONDARY};">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin:0;font-size:14px;color:${TEXT_SECONDARY};">
            <strong>Temporary Password:</strong>
            <span style="font-family:monospace;background-color:#ffffff;padding:2px 8px;border-radius:4px;font-size:15px;color:${BRAND_GREEN};font-weight:600;">
              ${tempPassword}
            </span>
          </p>
        </td>
      </tr>
    </table>

    ${buttonHtml(`${appUrl}/login`, "Sign In to EarthEcho")}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0 0;background-color:#FFF8E1;border-radius:8px;border:1px solid #FFE082;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#F57F17;">
            &#9888; Important
          </p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.7;color:${TEXT_SECONDARY};">
            <li>Please change your password after your first sign-in.</li>
            <li>Do not share these credentials with anyone.</li>
          </ul>
        </td>
      </tr>
    </table>`;

  await sendEmail(
    email,
    "You've been invited as an EarthEcho Admin",
    emailWrapper(body),
  );
}

// ---------------------------------------------------------------------------
// Email HTML generators (for previews)
// ---------------------------------------------------------------------------

export function getWelcomeEmailHtml(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Welcome to EarthEcho, ${name}!
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We're thrilled to have you join our community of environmentally-conscious individuals
      committed to making a positive impact on the planet.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      With EarthEcho you can:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 8px;">
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Track your carbon footprint across transport, energy, shopping &amp; more</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Complete eco-challenges and earn badges</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Join the community forum and share your journey</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 4px 0;font-size:15px;color:${BRAND_GREEN};vertical-align:top;">&#9679;</td>
        <td style="padding:4px 0;font-size:15px;color:${TEXT_SECONDARY};">Climb the leaderboard and inspire others</td>
      </tr>
    </table>
    ${buttonHtml(`${appUrl}/dashboard`, "Go to Your Dashboard")}
    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">
      Every small action adds up. Let's make a difference together.
    </p>`;
  return emailWrapper(body);
}

export function getPasswordResetEmailHtml(name: string): string {
  const resetUrl = "https://earthecho.co.uk/reset-password?token=example-token";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Password Reset Request
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Hi ${name},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We received a request to reset the password associated with your EarthEcho account.
      Click the button below to set a new password.
    </p>
    ${buttonHtml(resetUrl, "Reset Your Password")}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0 0;background-color:#FFF8E1;border-radius:8px;border:1px solid #FFE082;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#F57F17;">
            &#9888; Important Security Information
          </p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.7;color:${TEXT_SECONDARY};">
            <li>This link expires in <strong>1 hour</strong> for your security.</li>
            <li>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</li>
            <li>Never share this link with anyone. EarthEcho staff will never ask for your password.</li>
          </ul>
        </td>
      </tr>
    </table>`;
  return emailWrapper(body);
}

export function getBanNotificationEmailHtml(name: string, reason: string): string {
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      Account Suspended
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Dear ${name},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      We are writing to inform you that your EarthEcho account has been suspended
      following a review of your activity on the platform.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:#FFEBEE;border-radius:8px;border-left:4px solid #C62828;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#C62828;text-transform:uppercase;letter-spacing:0.5px;">
            Reason for Suspension
          </p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:${TEXT_PRIMARY};">
            ${reason}
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      If you believe this action was taken in error, please contact our support team
      by replying to this email.
    </p>`;
  return emailWrapper(body);
}

export function getAdminInviteEmailHtml(email: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${TEXT_PRIMARY};">
      You've Been Invited as an Admin
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      You have been invited to join the EarthEcho platform as an <strong>administrator</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Use the credentials below to sign in:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:${BRAND_LIGHT};border-radius:8px;border:1px solid #B7E4C7;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;color:${TEXT_SECONDARY};">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin:0;font-size:14px;color:${TEXT_SECONDARY};">
            <strong>Temporary Password:</strong>
            <span style="font-family:monospace;background-color:#ffffff;padding:2px 8px;border-radius:4px;font-size:15px;color:${BRAND_GREEN};font-weight:600;">
              ••••••••••••
            </span>
          </p>
        </td>
      </tr>
    </table>
    ${buttonHtml(`${appUrl}/login`, "Sign In to EarthEcho")}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0 0;background-color:#FFF8E1;border-radius:8px;border:1px solid #FFE082;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#F57F17;">
            &#9888; Important
          </p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.7;color:${TEXT_SECONDARY};">
            <li>Please change your password after your first sign-in.</li>
            <li>Do not share these credentials with anyone.</li>
          </ul>
        </td>
      </tr>
    </table>`;
  return emailWrapper(body);
}

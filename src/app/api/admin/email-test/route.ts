import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/admin/email-test
 * Sends a smoke-test email to verify SMTP configuration.
 * Requires superadmin/developer role.
 */
export async function POST(req: Request) {
  try {
    const admin = await requireSuperAdmin();
    const { to } = await req.json();
    const recipient = to || admin.email;

    if (!recipient) {
      return NextResponse.json(
        { success: false, error: "No recipient email provided" },
        { status: 400 },
      );
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#2D6A4F;">EarthEcho SMTP Smoke Test</h2>
        <p>If you're reading this, your email configuration is working correctly.</p>
        <ul style="line-height:1.8;">
          <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
          <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
          <li><strong>SMTP User:</strong> ${process.env.SMTP_USER}</li>
          <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
        </ul>
        <p style="color:#888;font-size:12px;">Triggered by admin: ${admin.email}</p>
      </div>`;

    await sendEmail(recipient, "EarthEcho SMTP Smoke Test", html);

    return NextResponse.json({ success: true, sentTo: recipient });
  } catch (e) {
    console.error("[EMAIL-TEST]", e);
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

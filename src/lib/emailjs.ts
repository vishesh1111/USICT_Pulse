import emailjs from "@emailjs/browser";

// ── EmailJS Config ──────────────────────────────────────────────────────
// You need to set these in your .env.local file:
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
//   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
//   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
//
// Setup instructions:
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail works great) → copy the Service ID
// 3. Create an Email Template with these variables:
//    - {{to_email}}    → recipient email
//    - {{to_name}}     → recipient name
//    - {{subject}}     → email subject
//    - {{message}}     → email body (HTML supported)
// 4. Copy the Template ID and your Public Key from Account → General

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export function isEmailJSConfigured(): boolean {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendWelcomeEmail(
  toEmail: string,
  toName: string,
  role: "junior" | "senior"
): Promise<boolean> {
  if (!isEmailJSConfigured()) {
    console.warn("[EmailJS] Not configured — skipping email send. Set env vars to enable.");
    return false;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        user_email: toEmail,
        name: toName,
        subject: "Welcome to USICT PULSE! 🎉",
        message: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to USICT PULSE</h1>
              <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">The pulse of USICT — discover, connect, grow.</p>
            </div>
            <div style="background: #1a1a2e; padding: 32px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
              <p style="font-size: 16px;">Hey <strong style="color: #a78bfa;">${toName}</strong>! 👋</p>
              <p>You've successfully joined USICT PULSE as a <strong style="color: ${role === "senior" ? "#f0abfc" : "#67e8f9"};">${role === "senior" ? "Senior Mentor" : "Junior Explorer"}</strong>.</p>
              <p>Here's what you can do now:</p>
              <ul style="padding-left: 20px; line-height: 1.8;">
                ${role === "senior" ? `
                  <li>📚 Share resources to help juniors</li>
                  <li>💬 Answer anonymous questions</li>
                  <li>🏆 Your credibility score is live</li>
                ` : `
                  <li>🔍 Discover internships & scholarships</li>
                  <li>💬 Ask anonymous questions to seniors</li>
                  <li>📚 Access curated learning resources</li>
                `}
              </ul>
              <div style="margin-top: 24px; text-align: center;">
                <a href="https://usict-pulse.vercel.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">Open Dashboard →</a>
              </div>
              <p style="margin-top: 24px; font-size: 12px; color: #888;">You're receiving this because you signed up on USICT PULSE.</p>
            </div>
          </div>
        `,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error("[EmailJS] Failed to send welcome email:", error);
    return false;
  }
}

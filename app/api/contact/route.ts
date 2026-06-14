import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formType, name, email, phone, subject, message, organizationName, category, quantity } = body;

    // 1. Basic validation
    if (!formType || !name || !email) {
      return NextResponse.json({ error: "Missing required fields (formType, name, email)." }, { status: 400 });
    }

    // 2. Validate payload matching formType
    if (formType === "contact") {
      if (!message) {
        return NextResponse.json({ error: "Message is required for general inquiries." }, { status: 400 });
      }
    } else if (formType === "bulk") {
      if (!category || !quantity) {
        return NextResponse.json({ error: "Category and Quantity are required for bulk orders." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid formType. Must be 'contact' or 'bulk'." }, { status: 400 });
    }

    // 3. Construct Email Body
    const titleText = formType === "contact" ? "New General Inquiry" : "New Bulk Order Request";
    const brandColor = formType === "contact" ? "#3452ef" : "#0d7fba";
    const accentColor = formType === "contact" ? "#fcb643" : "#ffc300";

    let detailsHtml = "";
    if (formType === "contact") {
      detailsHtml = `
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject || "General Inquiry"}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message}</td></tr>
      `;
    } else {
      detailsHtml = `
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Organization Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${organizationName || "Not provided"}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Device Category:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee; text-transform: capitalize;">${category}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${quantity}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; vertical-align: top;"><strong>Additional Message:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message || "No additional requirements"}</td></tr>
      `;
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${titleText}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f6f5f8; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
            <div style="background-color: ${brandColor}; padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">Comsri Corporation</h1>
              <p style="color: ${accentColor}; margin: 5px 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${titleText}</p>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; margin-top: 0;">You have received a new form submission with the following details:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
                <tbody>
                  <tr><td style="width: 35%; padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: ${brandColor}; text-decoration: none;">${email}</a></td></tr>
                  ${detailsHtml}
                </tbody>
              </table>
              <div style="margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px; font-size: 12px; color: #666; text-align: center; border: 1px dashed #e5e7eb;">
                This inquiry was submitted from the Comsri Corporation website.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // 4. Retrieve SMTP Configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailTo = process.env.EMAIL_TO || "info@comsri.com";

    const isSmtpConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPass);

    if (isSmtpConfigured) {
      console.log(`[Email Service]: SMTP configured. Sending mail to ${emailTo}...`);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort!, 10),
        secure: smtpPort === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const emailSubject = formType === "contact" 
        ? `Contact Form: ${subject || "General Inquiry"} - ${name}`
        : `Bulk Order Form Request: ${category.toUpperCase()} (${quantity} units) - ${name}`;

      await transporter.sendMail({
        from: `"${name} (via Website)" <${smtpUser}>`,
        to: emailTo,
        replyTo: email,
        subject: emailSubject,
        html: htmlBody,
      });

      return NextResponse.json({ success: true, message: "Email notification dispatched successfully." });
    } else {
      // Development Fallback
      console.log("======================================================================");
      console.log(`[MOCK EMAIL SERVICE] - EMAIL ENVIRONMENT VARIABLES MISSING OR INCOMPLETE`);
      console.log(`To send actual emails, add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_TO to your .env file.`);
      console.log(`Recipient: ${emailTo}`);
      console.log(`Subject: ${formType === "contact" ? "Contact Form Submission" : "Bulk Order Submission"} from ${name}`);
      console.log("Payload:", body);
      console.log("======================================================================");

      return NextResponse.json({
        success: true,
        mocked: true,
        message: "Form submission logged to server console (SMTP not configured in environment variables)."
      });
    }
  } catch (error: any) {
    console.error("[Email Route Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process form submission." }, { status: 500 });
  }
}

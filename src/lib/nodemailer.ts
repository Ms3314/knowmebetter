import nodemailer from 'nodemailer';

// Get environment variables
const email = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;
const host = process.env.EMAIL_SERVER_HOST;
const port = process.env.EMAIL_SERVER_PORT;

// Create a development transporter if credentials are missing
let transporter: nodemailer.Transporter;
let mailOptions: { from: string; };

// Check if we have all required email configuration
if (!email || !pass || !host || !port) {
  console.warn('⚠️ Email configuration incomplete. Using development transporter.');
  
  // Create a test account with ethereal.email for development
  // This will output the preview URL in console during development
  const createDevTransporter = async () => {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    mailOptions = {
      from: `"Verification Service" <${testAccount.user}>`,
    };
    
    console.log('💡 Using Ethereal Email for development:');
    console.log(`› User: ${testAccount.user}`);
    console.log(`› Pass: ${testAccount.pass}`);
    console.log('› You can view sent emails at https://ethereal.email');
  };
  
  // Initialize the development transporter
  createDevTransporter().catch(console.error);
} else {
  // Create the production transporter with real credentials
  transporter = nodemailer.createTransport({
    host: host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user: email,
      pass: pass,
    },
  });
  
  mailOptions = {
    from: process.env.EMAIL_FROM || email,
  };
}

/**
 * Send email using Nodemailer
 * @param to Recipient email address
 * @param subject Email subject
 * @param html Email content in HTML format
 * @param text Plain text version of the email (optional)
 * @returns Promise that resolves to the information about the sent email
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) => {
  try {
    // Make sure the transporter is initialized
    if (!transporter) {
      throw new Error('Email transporter not initialized. Check your email configuration.');
    }
    
    const info = await transporter.sendMail({
      ...mailOptions,
      to,
      subject,
      html,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
    });
    
    // If using Ethereal in development, log the preview URL
    if (info.messageId && info.preview) {
      console.log('📧 Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Export the transporter and mailOptions for advanced usage
export { transporter, mailOptions }; 
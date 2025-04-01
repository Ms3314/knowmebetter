import { sendEmail } from "@/lib/nodemailer";
import { renderReactEmailToHtml } from "@/lib/reactEmailRenderer";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail (
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        // Log the start of the email sending process
        console.log(`📧 Sending verification email to ${email} for username ${username}`);
        
        // Render the React email component to HTML
        const emailHtml = await renderReactEmailToHtml(
            VerificationEmail({ username, otp: verifyCode })
        );
        
        // Send the email using Nodemailer
        const result = await sendEmail({
            to: email,
            subject: 'Your KnowmeBetter Verification Code',
            html: emailHtml,
        });
        
        if (result.success) {
            console.log(`✅ Verification email successfully sent to ${email}`);
            return { success: true, message: 'Verification email sent successfully' };
        } else {
            throw new Error('Failed to send email');
        }
    } catch (emailError: any) {
        console.error("❌ Error sending verification email:", emailError);
        return { 
            success: false, 
            message: `Failed to send email: ${emailError.message || 'Unknown error'}` 
        };
    }
}
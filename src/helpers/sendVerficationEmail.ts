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
        // Render the React email component to HTML
        const emailHtml = renderReactEmailToHtml(
            VerificationEmail({ username, otp: verifyCode })
        );

        // Add console.log to debug the HTML content
        // console.log("HTML content type:", typeof emailHtml, emailHtml);
        const emailHtmlFinal = await emailHtml;
        // Send the email using Nodemailer
        await sendEmail({
            to: email,
            subject: 'Mystery Verification Code',
            html:  emailHtmlFinal,
        });

        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.error("Error sending email:", emailError);
        return { success: false, message: 'Failed to send email' };
    }
}
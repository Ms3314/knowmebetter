import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail (
    email: string,
    username: string,
    verifyCode: string,
    
): Promise<ApiResponse> {
    try {
        // console.log("helpers", username, email, verifyCode)
        const resendMail = await resend.emails.send({
            from: 'mdsamiuddin2005@outlook.com',
            to: 'mdsamiuddin2005@outlook.com',
            subject: 'Mystry Verificaion code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        //   console.log(resendMail);
        return {success: true, message: 'Verification email send successfully'}
    } catch (Emailerror) {
        // console.log("Error sending Email" ,Emailerror);
        return {success: false, message: 'Failed to send email'}
    }
}
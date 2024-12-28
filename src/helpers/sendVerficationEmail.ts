import {resend} from '@/lib/resend'
import { verificationEmail } from '../../emails/verificationEmail'

import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(email :string ,username:string , verifyCode:number):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Email for knowmebetter',
            react: await verificationEmail({username , otp:verifyCode}) // Await the verificationEmail function call
        })
        return {success : false , message : 'Verifcation Email send succcesfully'}
    } catch (emailError) {
        console.error("Error sending verification email" , emailError)
        return {success : false , message : 'Failed to send verification email'}
    }
}
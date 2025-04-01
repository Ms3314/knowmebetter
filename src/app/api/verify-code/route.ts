import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/models/user";
import { JsonResponse } from "@/lib/helpers";

// verify-code route this is

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {email , code} = await request.json() ;
        const decodedEmail = decodeURIComponent(email)
        const user = await UserModel.findOne({email:decodedEmail})
        if(!user) {
            console.log(user , "this is the user")
            return JsonResponse("User is not found", false, 500);
        }
        const isCodeValid = user.verifyCode === code ;
        const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry) ; 
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true ;
            await user.save()
            return JsonResponse("Account verified Successfully", true, 200);
        }else if (!isCodeNotExpired) {
            return JsonResponse("Verification Code has expired please sign up again to get a new code", false, 400);
        } else {
            return JsonResponse("Incorrect Verification Code", false, 400);
        }
    } catch (error) {
        const ErrorMessage = error as Error
        return JsonResponse("Error Verifying user" + ErrorMessage.message, false, 500);
    }
}

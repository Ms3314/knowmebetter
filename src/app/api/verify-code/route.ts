import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { JsonResponse } from "@/lib/helpers";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import { type NextResponse } from 'next/server';

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username , code} = await request.json() ;
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user) {
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
        console.log(error)
        return JsonResponse("Error Verifying user", false, 500);
    }
}

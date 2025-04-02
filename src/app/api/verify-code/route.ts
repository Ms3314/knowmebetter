import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/models/user";
import { JsonResponse } from "@/lib/helpers";

// verify-code route this is

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, code } = await request.json();
        
        // Ensure we have both required parameters
        if (!email || !code) {
            return JsonResponse("Email and verification code are required", false, 400);
        }
        
        // Find the user by email
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            // console.log("User not found for email:", email);
            return JsonResponse("User not found. Please check your email address or sign up again.", false, 404);
        }
        
        // Check if the verification code is valid and not expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry);
        
        if (isCodeValid && isCodeNotExpired) {
            // Mark the user as verified
            user.isVerified = true;
            await user.save();
            return JsonResponse("Account verified successfully! You can now sign in.", true, 200);
        } else if (!isCodeNotExpired) {
            return JsonResponse("Verification code has expired. Please sign up again to get a new code.", false, 400);
        } else {
            return JsonResponse("Incorrect verification code. Please try again.", false, 400);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error in verify-code route:", error);
        return JsonResponse(`Error verifying user: ${errorMessage}`, false, 500);
    }
}

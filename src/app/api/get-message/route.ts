import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import mongoose, { Error } from "mongoose";
import { UserModel } from "@/models/user";

export async function GET () {
    await dbConnect();
    const session = await getServerSession(authOption) 
    const user: User = session?.user as User ;

    if(!session || !user) {
        return JsonResponse("You are not authenticated", false, 401);
    }

    const userid = new mongoose.Types.ObjectId(user._id);
    console.log("what is this user id " , userid)
    try {
        const userWithMessages = await UserModel.findOne({ _id: userid })
            .populate("messages") // Populate the messages array with message documents
            .exec();
            
        
            console.log(userWithMessages , "user with messahes")
        if (!userWithMessages) {
            return JsonResponse("No messages found for this user.", false, 204);
        }
        
        return Response.json({
            success: true,
            user: userWithMessages,
        }, {status: 200});
    } catch (error: unknown) {
        const ErrorMessage = error as Error
        return JsonResponse("An error occurred while fetching the messages: " + ErrorMessage.message  , false, 500);
    }
}




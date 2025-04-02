
import dbConnect from "@/lib/dbConnect";
import {UserModel , MessageModel } from "@/models/user";
import { JsonResponse } from "@/lib/helpers";
import mongoose from "mongoose";



export async function POST (request : Request) {
    // console.log("is the send-message route being called mann !!!!")
    await dbConnect();
    const {username , content} = await request.json()
    // console.log(username , content)
    try {
        const user = await UserModel.findOne({username : username})
        if(!user) {
            // console.log(user)
            return JsonResponse("User is not found" , false , 404)
        }
        // ise User Excepting the messages 

        if (!user?.isAcceptingMessage) {
            return JsonResponse("User is not accepting the messages" , false , 403)
        }
        const savedMessage = await MessageModel.create({ content, userId: user._id });
        // @ts-expect-error-this takes an object id which we are giivng 
        const messageId = new mongoose.Types.ObjectId(savedMessage._id);
        user.messages.push(messageId);

        await user?.save()
        return JsonResponse("Message send successfully : " + content, true, 200);
    } catch (error) {
        const ErrorMessage = error as Error
        return JsonResponse("this is the error message" + ErrorMessage.message, false , 500)
    }
}

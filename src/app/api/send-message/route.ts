import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import mongoose from "mongoose";
import { MessagaSchema } from "@/models/user";
import { Message } from "@/models/user";



export async function POST (request : Request) {
    await dbConnect();
    const {username , content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user) {
            return JsonResponse("User is not found" , false , 404)
        }
        // ise User Excepting the messages 
        if (!user?.isAcceptingMessage) {
            return JsonResponse("User is not accepting the messages" , false , 403)
        }

        const newMessage = {content , createdAt : new Date()}
        user?.messages.push(newMessage as Message) ; 
        await user?.save()
        return JsonResponse("Message send successfully" , true , 200)
    } catch (error:any) {
        return JsonResponse(error.message , false , 403)
    }
}
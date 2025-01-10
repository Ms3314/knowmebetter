import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import mongoose from "mongoose";

export async function GET (request : Request) {
    await dbConnect() ;
    const session = await getServerSession(authOption) 
    const user: User = session?.user as User ;
    // if the session doess not exist then you sre not authenticated
    if(!session || !user) {
        return JsonResponse("You are not authenticated" , false , 401)
    }
    const userid = new mongoose.Types.ObjectId(user._id) ;
    try {
        const user = await UserModel.aggregate([
            {$match : {id : userid} },
            {$unwind : '$messages'} ,
            {$sort : {'messages.createdAt' : -1}} ,
            {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        ])
        if(!user || user.length === 0) {
            return JsonResponse("User is not found" , false , 401)
        }
        return Response.json({
            success : true , 
            messages : user[0].messages ,
        },{status : 200}
        )
    } catch (error:any) {
        return JsonResponse(error.message ,false , 500 )
    }



}



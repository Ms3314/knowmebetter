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
        console.log("is this hitting in 404")
        return JsonResponse("You are not authenticated" , false , 401)
    }
    const userid = new mongoose.Types.ObjectId(user._id) ;
    try {
        // const user = await UserModel.aggregate([
        //     {$match : {id : userid} },
        //     {$unwind : '$messages'} ,
        //     {$sort : {'messages.createdAt' : -1}} ,
        //     {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        // ])
        const user = await UserModel.findOne({
            _id : userid
        })
        console.log(user.messages , "this is the user")
        if(!user || user.length === 0) {
            return JsonResponse("No messages yet " , true , 204)
        }
        return Response.json({
            success : true , 
            // messages : user[0].messages ,
            user : user ,
            messages : user.messages ,
        },{status : 200}
        )
    } catch (error:any) {
        return JsonResponse("An error occured while fetching the messages" + error.message  ,false , 500 )
    }



}



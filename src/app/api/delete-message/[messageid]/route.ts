import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import { User } from "lucide-react";

export async function DELETE (request : Request , {params} : {params : {messageid : string}}) {
    const messageid = params.messageid
    await dbConnect() ;
    const session = await getServerSession(authOption) 
    const user: User = session?.user as User ;
    // if the session doess not exist then you sre not authenticated
    if(!session || !user) {
        return JsonResponse("You are not authenticated" , false , 401)
    }
    try {
        const updatedResult = await UserModel.updateOne(
            {_id : user._id} ,
            {$pull : {messages: {_id : messageid}}}
        )
        if (updatedResult.modifiedCount == 0) {
            return JsonResponse("Message not found or already deleted" , false , 404)
        }
        return  JsonResponse("Message has been deleted" , true , 200)
    } catch (error) {
        console.log("Error in deleting an message" , error.message)
        return JsonResponse("Error deleting messages" , false , 500)
    }


}



import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {MessageModel} from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import { AxiosError } from "axios";

interface Errormsg extends AxiosError {
    message : string
}

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
        await MessageModel.findByIdAndDelete(messageid)
        return  JsonResponse("Message has been deleted" , true , 200)
    } catch (error) {
        const errorMsg = error as Errormsg;
        console.log("Error in deleting an message" , errorMsg.message)
        return JsonResponse("Error deleting messages" , false , 500)
    }


}



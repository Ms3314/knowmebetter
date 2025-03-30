import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import { AxiosError } from "axios";

export async function POST (request : Request) {
    await dbConnect() ;
    const session = await getServerSession(authOption) 
    const user: User = session?.user as User ;
    // if the session doess not exist then you sre not authenticated
    if(!session || !user) {
        return JsonResponse("You are not authenticated" , false , 401)
    }
    const userid = user._id ;
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userid , 
            {isAcceptingMessage : acceptMessage} ,
            {new : true}
        )
        if(!updatedUser) {
            JsonResponse("failed to update user Status tp accept messages",false , 401)
        } 
        else {
            JsonResponse("message update succesfully",true , 401)
        }
    } catch (error) {
        console.log("failed to update user Status tp accept messages");
        JsonResponse("failed to update user Status tp accept messages",false , 500)
    }
    
}

export async function GET () {
    try {
        await dbConnect() ;
        const session = await getServerSession(authOption) 
        const user: User = session?.user as User ;
        // if the session doess not exist then you sre not authenticated
        if(!session || !user) {
            return JsonResponse("You are not authenticated" , false , 401)
        }
        const userid = user._id ;
        const foundUser = await UserModel.findById(userid); 
        console.log(userid , "does this exist")
        console.log(foundUser , "does this exist")
        if(!foundUser) {
            return JsonResponse("User is not found" + userid , false , 404)
        }
        return Response.json({
            success : true ,
            // @ts-expect-error-need to check what is in the founduser
            isAcceptineMessages : foundUser.isAcceptingMessages  
        })
    } catch (error) {
        return JsonResponse("Something went wrong while checking the status" + error , false , 500 )
    }
    
}
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import { AxiosError } from "axios";
import { UserModel } from "@/models/user";

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
        console.log(updatedUser , "this is the updated user")
        if(!updatedUser) {
            return JsonResponse("failed to update user Status tp accept messages",false , 401)
        } 
        else {
            return JsonResponse("message update succesfully",true , 200)
        }
    } catch (error) {
        return JsonResponse("failed to update user Status tp accept messages " + error.message ,false , 500)
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
        console.log(userid , "this is the user id")
        const foundUser = await UserModel.findOne({ _id : userid}); 
        console.log(foundUser , "does this exist")  
        console.log(foundUser , "does this exist")
        if(!foundUser) {
            return JsonResponse("User is not found" + userid , false , 404)
        }
        return Response.json({
            success : true ,
            isAcceptingMessages : foundUser.isAcceptingMessage    
        })
    } catch (error) {
        return JsonResponse("Something went wrong while checking the status" + error.message , false , 500 )
    }
    
}
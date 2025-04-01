import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/models/user";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET (request :Request) {
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }
        console.log(searchParams.get('username'))
        const result = UsernameQuerySchema.safeParse(queryParam)
        // usernameValidation.safeParse(queryParam)
        console.log(result , "this is the rresult of the check")
        console.log(result.error?.format() , "this is the rresult of the check")
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || [] 
            return Response.json({
                success : false  ,
                message : usernameErrors
            } , {status : 400})
        }
        const {username} = result.data ;
        console.log(username , "username")
        const isExistingUsername = await UserModel.findOne({username , isVerified : true })
        if(isExistingUsername) {
            return Response.json({
                success : false  ,
                message : "Username is already taken"
            } , {status : 400})
        } else {
            return Response.json({
                success : true   ,
                message : "Username is unique"
            } , {status : 200})
        }
    } catch (error) {
        const ErrorMessage = error as Error
        return Response.json({
            success : false ,
            message :"Error checking username" + ErrorMessage.message
        },
        {status : 500}
    ) 
    }
}   
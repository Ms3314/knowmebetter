import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username , email , password} = await request.json();        
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username ,
            isVerified : true 
        })
        //now that there exist an user with the same username 
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success : false ,
                message : "Username is already taken"
            },{status:400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({email});
        
        // checking if the email exist in the DB 
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        console.log(verifyCode)
        // checking if the email already exists 
        if(existingUserVerifiedByEmail) {
            // is this thing verified ? YES
            if(existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success : false , 
                    message : "User already exists with this email",
                },{status:500})
            }
            // NO its not verified them 
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hashedPassword ;
                existingUserVerifiedByEmail.verifyCode = verifyCode ;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            // here although we are using a const for the expiry  data but the new keyword generates an object thus whateevr u name it const or let u can mutate the object 
            const newUser = new UserModel({
                username ,
                email ,
                password : hashedPassword,
                verifyCode ,
                verifyCodeExpiry :expiryDate,
                isVerified :  false,
                isAcceptingMessage : true ,
                messages : []
            })
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(email , username , verifyCode)
        if(!emailResponse.success) {
            return Response.json({
                success : false , 
                message : emailResponse.message,
            },{status:500})
        }
        return Response.json({
            success : true ,
            message : "User registered successfully , Please verify your email"
        },{status:201})

    } catch (error) {
        console.error("Erro registering user" , error)
        return Response.json({
            success : false ,
            message : "Error registering the user"
        },
        {
            status : 500
        }
    )
    }
}
// we are not handling anythig like verifyingthe specfcif user here so that is why we are having an another route for this thing 


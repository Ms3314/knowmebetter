import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs" ;
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export const authOption:NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials : {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                email : {label : "Email" , type:"text" , placeholder:"jsmith@smith.com"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any> {
                await dbConnect();
                try {
                    const User = await UserModel.findOne({
                        $or :[
                            {email : credentials.identifier},
                            {username : credentials.identifier},
                        ]
                    })
                    if(!User) {
                        throw new Error('No User found witht he email');
                    }
                    if(!User.isVerified) {
                        throw new Error("Please verify your account before you login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password , User.password )
                    if(isPasswordCorrect) {
                        throw new Error("Incorrect Password");
                    }
                    return 1 ;
                } catch (err:string | unknown) {
                    throw new Error(String(err)) ; 
                }
            }
        })
    ]
}
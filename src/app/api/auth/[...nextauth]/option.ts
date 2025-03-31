/* eslint-disable */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs" ;
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/models/user";

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
                        throw new Error('No User found with this email');
                    }
                    if(!User.isVerified) {
                        throw new Error("Please verify your account before you login");
                    }
                    // here the thing is we are having credentials.password for pass above for the username and email we can just .identifier            
                    const isPasswordCorrect = await bcrypt.compare(credentials.password , User.password )
                    if(isPasswordCorrect) {
                        return User 
                    }else {
                        throw new Error("Credentials are invalid")
                    }
                } catch (err:string | unknown) {
                    throw new Error(String(err)) ; 
                }
            }
        })
    ] , 
    callbacks : {
        async jwt({token , user}) {
            if(user) {
                // as we re declared the types in out next-auth.d.ts , the error just vanished away 
                token._id = user._id?.toString() ;
                token.isVerified = user.isVerified ;
                token.isAcceptingMessages = user.isAcceptingMessages ; 
                token.username = user.username ;
            }
            return token 
        },
        async session({token , session}) {
            if (token) {
                session.user._id  = token._id, 
                session.user.isVerified  = token.isVerified ,
                session.user.isAcceptingMessages  = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session 
        } , 
    } , 
    pages : {
        signIn : '/signin'
    } ,
    session :{
        strategy : "jwt"
    } ,
    secret : process.env.NEXTAUTH_SECRET ,
}
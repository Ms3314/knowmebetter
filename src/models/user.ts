import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document{
    content : string ;
    createdAt : Date
}

const MessagaSchema:Schema<Message> = new Schema({
    content : {
        type : String ,
        required : true 
    },
    createdAt : {
        type : Date ,
        required : true ,
        default : Date.now()
    }
})  

export interface User extends Document{
    username : string ;
    email : string ;
    password : string ;
    varifyCode : string ;
    verifyCodeExpiry : Date ;
    isAcceptingMessage : boolean ;
    message : Message[]
}

const UserSchema:Schema<User> = new Schema({
    username : {
        type : String ,
        required : [true , "Username is required"], 
    },
    verifyCodeExpiry : {
        type : Date ,
        required : true ,
        default : Date.now()
    }
})  

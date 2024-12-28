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
    isVerified : boolean ;
    isAcceptingMessage : boolean ;
    messages : Message[]
}

const UserSchema:Schema<User> = new Schema({
    username : {
        type : String ,
        required : [true , "Username is required"], 
    },
    email : {
        type : String ,
        require : [true , 'email is rquired'] ,
        unique : true ,  
        match : [/.+\@.+\..+/,'please use a valid email address']
    },
    password: {
        type : String ,
        require : [true , 'password is rquired'] ,
    },
    varifyCode : {
        type : String ,
        required : [true , "VerifyCode is required"] ,
    },
    verifyCodeExpiry : {
        type : Date ,
        required : true ,
        default : Date.now() 
    },
    isAcceptingMessage:{
        type : Boolean ,
    },
    isVerified:{
        type : Boolean ,
        default : false ,
    } , 
    messages :{
        type : [MessagaSchema]
    }
})  

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))

export default UserModel
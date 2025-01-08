import 'next-auth'
import { DefaultSession } from 'next-auth'

// here we are just adding some extra types to an existing types of next-auth its like you are updating it 

declare module 'next-auth' {
    interface User {
        _id? : string
        isVerified? : boolean 
        isAcceptingMessages? : boolean ,
        username? :string ,
    }
    interface Session {
        user : {
            _id? : string
            isVerified? : boolean 
            isAcceptingMessages? : boolean ,
            username? :string ,
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id? : string
        isVerified? : boolean 
        isAcceptingMessages? : boolean ,
        username? :string ,
    }
}


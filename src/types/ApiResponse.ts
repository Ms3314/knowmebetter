import { Message } from "@/models/user";


// so basically all the api responses will look like this 
// this will be a stardard methood to transfer the data
export interface ApiResponse {
    success : boolean , 
    message : string ,
    isAcceptingMessages?: boolean ,
    messages?: Array<Message> ,
}
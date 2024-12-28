import {z} from 'zod'

export const MessageSchema = z.object({
    // this can be called anything be it a username or be it an email 
    content : z.string().min(10 , {message : 'Contnt must be of atleast 10 charaters'}).max(300 , {message : 'Contnt must be of maximum 3000 charaters'}) , 

})

import {z} from 'zod'

export const signInSchema = z.object({
    // this can be called anything be it a username or be it an email 
    identifier : z.string() , 
    password : z.string()
})

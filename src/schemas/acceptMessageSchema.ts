import {z} from 'zod'

export const signInSchema = z.object({
    // this can be called anything be it a username or be it an email 
    acceptMessages : z.boolean(),
})
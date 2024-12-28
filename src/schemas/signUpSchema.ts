import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2 , "User name must be of atleast 3 characters")
    .max(20 , "No more than 20 characters ") 
    .regex(/^[a-zA-Z0-9]+$/ , "username must not contain special character")

export const signUpSchema = z.object({
    username : usernameValidation , 
    email : z.string().email({message:'invalid email address'}),
    password : z.string().min(6 , {message : "password must be of minimun fo 6 charaters "})
})
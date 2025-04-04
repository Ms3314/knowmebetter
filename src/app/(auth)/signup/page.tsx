'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  {z} from "zod"
 import Link from "next/link"
import { useEffect, useState } from "react"
import {  useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2 } from "lucide-react"

const Page = () => {
  const [isCheckingUsername , setIsCheckingUsername] = useState(false);
  const [username , setUsername] = useState('') ; 
  const [usernameMessage , setUsernameMessage] = useState('') ;
  const [isSubmitting , setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername , 300) ;
  const {toast} = useToast()
  const router = useRouter()

  // zod implimentation 
  const form = useForm({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : '' ,
      email : '' ,
      password: '' 
    }
  })

  useEffect(()=>{
    const checkUsernameUniques = async () => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
            const reponse = await axios.get(`/api/check-username-unique?username=${username}`);
            setUsernameMessage(reponse.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setUsernameMessage(axiosError.response?.data.message || "Checking username Error")
        } finally {
          setIsCheckingUsername(false)
          setIsSubmitting(false)
        }
      }
    }
    checkUsernameUniques()
  },[username])
    
  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup' , data)
      toast({
        title : 'Success' , 
        description : response.data.message
      })
      router.replace(`verify/${data.email}`) ; 
      setIsSubmitting(false)
    } catch (error) {
      console.error(error , "Error in signup of the user")
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message 
      toast({
        title : 'Singn Up failed',
        description : errorMessage ,
        variant : "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join KnowmeBetter
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
          <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                  onChange={(e)=>{
                    field.onChange(e)
                    debounced(e.target.value)
                  }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin" />}
              <p className={`test-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500' } `}>
                 {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        /> 
          <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
          <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                </>
              ) : ( 'SingUp')
            }
          </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>
              Already A memeber? {' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
        </div>
      </div>
    </main>
  )
}

export default Page

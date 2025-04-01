"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VerifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

const VerfifyAccount = () => {
    const router = useRouter()
    const { email: encodedEmail } = useParams<{ email: string }>()
    const [decodedEmail, setDecodedEmail] = useState<string>('')
    const { toast } = useToast()
    
    // Decode the email parameter when component mounts
    useEffect(() => {
        if (encodedEmail) {
            try {
                // Decode the email from URL parameter
                const decoded = decodeURIComponent(encodedEmail)
                setDecodedEmail(decoded)
            } catch (error) {
                console.error('Error decoding email:', error)
                // Fallback to the raw value if decoding fails
                setDecodedEmail(encodedEmail as string)
            }
        }
    }, [encodedEmail])
    
    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
    })

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                email: decodedEmail,
                code: data.code 
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/signin')
        } catch (error) {
            console.error(error, "Error in verification process")
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message || 'Verification failed'
            toast({
                title: 'Verification Failed',
                description: errorMessage,
                variant: "destructive" 
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100"> 
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join KnowmeBetter
                    </h1>
                    <p className="mb-4">A verification code has been sent to <span className="font-medium">{decodedEmail}</span></p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <p className='text-slate-500 text-sm'>Please check your junk folder if you're having difficulty finding the code</p>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerfifyAccount

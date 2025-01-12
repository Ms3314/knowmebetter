import { useToast } from '@/hooks/use-toast';
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { Message } from 'postcss'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { userAgent } from 'next/server';

const Page = () => {
    // iska jo type hai wah message hai as we are adding it init 
    const [messages , setMessages] = useState<Message[]>([])
    const [isLoading , setIsLoading] = useState(false) ;
    const [isSwitchLoading , setIsSwitchLoading] = useState(false) ;
    const {toast} = useToast();

    const handleDeleteMessage = (messageid  : string) => {
        setMessages(messages.filter((message:Message) => message._id !== messageid))
    }

    const {data : session} = useSession()

    const form = useForm({
        resolver : zodResolver(acceptMessagesSchema)
    })

    const {register , watch , setValue} = form ;

    const acceptMessages = watch('acceptMessages')
    
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message')
            setValue('acceptMessages' , response.data.isAcceptingMessages )
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title : "Error" ,
                description : axiosError.response?.data.message || "Failed to fetch message settings" ,
                variant :"destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    },[setValue])


    const fetchMessages = useCallback(async (refresh : boolean = false) =>  {
        setIsLoading(true)  
        setIsSwitchLoading(false) 
        try {
            const response = await axios.get('api/get-message')
            setMessages(response.data.messages || []) ;
            if(refresh) {
                toast({
                    title : "Refreshed Messages" ,
                    description : "Showing the latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title : "Error" ,
                description : axiosError.response?.data.message || "Failed to fetch message settings" ,
                variant :"destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    } , [setIsLoading , setMessages])

    useEffect(()=>{
        if(!session || !session.user ) return 
        fetchMessages()
        fetchAcceptMessage()
    },[session , setValue , fetchAcceptMessage , fetchMessages])

    // handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message');
            setValue('acceptMessage' , !acceptMessages) ;
            toast({
                title : response.data.message ,
                variant : 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title : "Error" ,
                description : axiosError.response?.data.message || "Failed to fetch message settings" ,
                variant :"destructive"
        })
        }
    }

    if(!session || !session.user) {
        return <div>
            Please Log in
        </div>
    }

    return (
    <div>
      
    </div>
  )
}

export default Page

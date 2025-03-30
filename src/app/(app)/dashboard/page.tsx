'use client'

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
import MessageCard from '@/components/MessageCard';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@react-email/components';
import { Separator } from '@radix-ui/react-separator';
import { Switch } from '@radix-ui/react-switch';

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
            console.log(response.data.messages )
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
                description : axiosError.response?.data.message || "Failed to change message settings" ,
                variant :"destructive"
        })
        }
    }

    if(!session || !session.user) {
        return <div>
            Please Log in
        </div>
    }

    const { username } = session.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    const copyToClipboard = () => {
        console.log(session.user as User);
        navigator.clipboard.writeText(profileUrl);
        toast({
          title: "URL Copied",
          description: "Profile URL copied to clipboard",
        });
    };

    return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold  mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button className='cursor-pointer' onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading} 
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
          className="mt-4"
          onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index} 
            //@ts-expect-error-the problem is with maybe we dont know the types of the messages
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Page

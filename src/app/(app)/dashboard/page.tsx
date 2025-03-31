'use client'

import { useToast } from '@/hooks/use-toast';
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
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
    const [isLoading , setIsLoading] = useState(true) ;
    const [isSwitchLoading , setIsSwitchLoading] = useState(true) ;
    const [isAcceptingMessage , setIsAcceptingMessage] = useState(true) ;
    const {toast} = useToast();

    const handleDeleteMessage = (messageid  : string) => {
        setMessages(messages.filter((message:Message) => message._id !== messageid))
    }

    const {data : session} = useSession()

    


    
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message')
            // console.log(response)
            // @ts-expect-error-this might throw error
            setIsAcceptingMessage(response.data.isAcceptingMessages)
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
    },[]);

    


    const fetchMessages = useCallback(async (refresh : boolean = false) =>  {
          setIsLoading(true)  
          setIsSwitchLoading(true) 
          try {
              const response = await axios.get('/api/get-message')
              // console.log(response , 'this is the reponse')
              setIsLoading(false)
              setMessages(response.data.user.messages || []) ;
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
      },[]) 

    useEffect(()=>{
        if(!session || !session.user ) return 
        fetchMessages()
        fetchAcceptMessage()
    },[fetchAcceptMessage , fetchMessages , session])

    // handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message' , {
              acceptMessage : !isAcceptingMessage
            });
            toast({
                title : "Accepting Message : " + (!isAcceptingMessage ? "On" : "Off") ,
                description : response.data.message ,
                variant : 'default'
            })
            setIsAcceptingMessage(!isAcceptingMessage)
            fetchMessages()
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
        // console.log(session.user as User);
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
      <div className="flex items-center mb-4">
            <Switch
              checked={isAcceptingMessage}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className={`relative inline-flex h-6 w-12 ${isAcceptingMessage ? ' pl-6 ' : ' '} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-200 data-[state=checked]:bg-blue-600`}
            >
              <span
                className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 translate-x-0 data-[state=checked]:translate-x-6"
              />
            </Switch>
            <span className="ml-2">
              Accept Messages: {isAcceptingMessage ? "On" : "Off"}
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

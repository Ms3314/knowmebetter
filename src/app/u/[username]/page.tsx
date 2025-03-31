'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
    const { username } = useParams();
    const [text, setText] = useState('');
    console.log(username, 'this is the username');

    // Timeout function to clear the text after submission

    const handleSubmitMessage = async () => {
        try {
            const response = await axios.post('/api/send-message', { content: text, username });
            if (response.data.success) {
                toast({
                    title: "Sent Successfully",
                    description: "Your message has been sent anonymously!",
                    variant: "default"
                });
                setText('')
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.error(axiosError.message);
            toast({
                title: "Error",
                description: axiosError.message || "Failed to send the message",
                variant: "destructive"
            });
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 py-8'>
            <Card className='w-full max-w-md shadow-lg rounded-2xl'>
                <CardHeader>
                    <h1 className='text-2xl font-bold text-center mb-4 text-gray-800'>
                        Send an Anonymous Message to <span className='text-blue-600'>{username}</span>
                    </h1>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)}
                        placeholder='Type your message here...'
                        className='resize-none mb-4'
                    />
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button className='w-[50%]' onClick={handleSubmitMessage}>
                        Send Message
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Page;

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

// UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Types
import { ApiResponse } from '@/types/ApiResponse';

const Page = () => {
  const { username } = useParams();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 100;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const handleSubmitMessage = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/send-message', { 
        content: text, 
        username 
      });
      
      if (response.data.success) {
        toast({
          title: "Message Sent",
          description: "Your anonymous message has been delivered successfully!",
          variant: "default"
        });
        setText('');
        setCharCount(0);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError.message);
      toast({
        title: "Failed to Send",
        description: axiosError.message || "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-300 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            KnowmeBetter
          </CardTitle>
          <CardDescription className="text-slate-500">
            Send a private messages ot questions <span className="font-medium text-blue-600">{username}</span> without revealing your identity.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          <Textarea 
            value={text} 
            onChange={handleTextChange}
            placeholder="Write your message here..."
            className="resize-none min-h-32 focus:border-blue-400 transition-all"
          />
          <div className="flex justify-end mt-2">
            <span className={`text-xs ${charCount > maxChars * 0.8 ? 'text-amber-600' : 'text-slate-400'}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full bg-pink-600 hover:bg-pik-700 transition-colors"
            onClick={handleSubmitMessage}
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          <p className="text-xs text-center text-slate-400 mt-2">
            All messages are anonymous and cannot be traced back to you.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
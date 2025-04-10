'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Heart, Brain, Lightbulb, Coffee } from 'lucide-react';

// Types
import { ApiResponse } from '@/types/ApiResponse';

// Define prompt categories with their associated colors
type PromptCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  cardBgColor: string;
  buttonColor: string;
};

const promptCategories: PromptCategory[] = [
  { 
    id: 'general', 
    name: 'General', 
    icon: <Coffee className="h-3 w-3 mr-1" />,
    bgColor: 'bg-blue-300',
    cardBgColor: 'bg-white',
    buttonColor: 'bg-blue-500 hover:bg-blue-700'
  },
  { 
    id: 'romantic', 
    name: 'Romantic', 
    icon: <Heart className="h-3 w-3 mr-1" />,
    bgColor: 'bg-pink-400',
    cardBgColor: 'bg-pink-50',
    buttonColor: 'bg-pink-600 hover:bg-pink-700'
  },
  { 
    id: 'intellectual', 
    name: 'Intellectual', 
    icon: <Brain className="h-3 w-3 mr-1" />,
    bgColor: 'bg-emerald-200',
    cardBgColor: 'bg-emerald-50',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    icon: <Lightbulb className="h-3 w-3 mr-1" />,
    bgColor: 'bg-amber-200',
    cardBgColor: 'bg-amber-50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700'
  },
];

const Page = () => {
  const { username } = useParams();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const maxChars = 100;

  // Get the current category object
  const currentCategory = promptCategories.find(cat => cat.id === selectedCategory) || promptCategories[0];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const fetchSuggestions = async (category = selectedCategory) => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(false);
    
    try {
      // Pass the category as a query parameter
      const response = await axios.get(`/api/suggest-message?category=${category}`);
      
      // Check for success response and handle data with fallbacks
      if (response.data.success) {
        // The data might be in message (old API) or data (new API)
        const responseText = response.data.message || response.data.data || '';
        
        if (responseText && responseText.includes('||')) {
          // Split the response by the delimiter '||'
          const questionArray = responseText.split('||').map((q: string) => q.trim());
          console.log("Suggestions loaded:", questionArray);
          setSuggestions(questionArray);
        } else {
          console.warn("Invalid suggestion format:", responseText);
          setSuggestionsError(true);
          setSuggestions([]);
        }
      } else {
        console.warn("API returned unsuccessful response");
        setSuggestionsError(true);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestionsError(true);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Change category and fetch new suggestions
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchSuggestions(category);
  };

  // Fetch suggestions on initial load
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.length <= maxChars) {
      setText(suggestion);
      setCharCount(suggestion.length);
    } else {
      // If suggestion is too long, trim it
      const trimmed = suggestion.substring(0, maxChars);
      setText(trimmed);
      setCharCount(trimmed.length);
      toast({
        title: "Message Trimmed",
        description: "The suggestion was too long and has been trimmed.",
        variant: "default"
      });
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
        description: axiosError.response?.data.message || "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${currentCategory.bgColor} p-4 transition-colors duration-300`}>
      <Card className={`w-full max-w-md shadow-lg border-0 ${currentCategory.cardBgColor} transition-colors duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            KnowmeBetter
          </CardTitle>
          <CardDescription className="text-slate-500">
            Send a private message or question to <span className="font-medium text-blue-600">{username}</span> without revealing your identity.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          {/* Suggestion section - we show a loading state or the buttons */}
          <div className="mb-4">
            {/* Category selection buttons */}
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-2">Question type:</p>
              <div className="flex flex-wrap gap-2">
                {promptCategories.map((category) => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`text-xs px-2 py-1 h-7 ${selectedCategory === category.id ? '' : 'hover:bg-opacity-20'}`}
                    onClick={() => handleCategoryChange(category.id)}
                    disabled={isLoadingSuggestions}
                  >
                    <div className="flex items-center">
                      {category.icon}
                      {category.name}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Suggested questions:</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchSuggestions(selectedCategory)} 
                disabled={isLoadingSuggestions}
                className="p-1 h-7"
              >
                {isLoadingSuggestions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
                <p className="ml-2 text-sm text-slate-500">Loading suggestions...</p>
              </div>
            ) : suggestionsError ? (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500">
                  Couldn&apos;t load suggestions. Try refreshing or just write your own message.
                </p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto py-2 text-sm w-full overflow-hidden"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="line-clamp-2 break-words">
                      {suggestion}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500">
                  No suggestions available. Try refreshing or just write your own message.
                </p>
              </div>
            )}
          </div>

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
            className={`w-full ${currentCategory.buttonColor} transition-colors duration-300`}
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
          
          {/* New section with create your own link */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-slate-600 mb-2">
              Want to receive anonymous messages too?
            </p>
            <Link 
              href="/signup" 
              className="text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors"
            >
              Create your own KnowmeBetter profile →
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
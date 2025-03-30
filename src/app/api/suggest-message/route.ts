import { JsonResponse } from '@/lib/helpers';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


export async function GET () {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversation. , and please dont givee me any charcaters other than "
    const { text } = await generateText({
      model: google('gemini-1.5-pro-latest'),
      prompt,
    });
    // console.log(text , "the message answer")
    return JsonResponse(text , true , 200)      
  } catch (error:unknown) {
    // console.log(error)
    JsonResponse( "something went wrong , llm error" , false , 500)
  }
    
}


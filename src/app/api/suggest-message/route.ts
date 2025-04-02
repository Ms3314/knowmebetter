import { JsonResponse } from '@/lib/helpers';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Array of different prompt variations to get more diverse responses
const promptVariations = [
  "Give me 3 thought-provoking questions about life experiences that friends might ask each other.",
  "Generate 3 fun and lighthearted questions that someone might ask to get to know a person better.",
  "Create 3 interesting conversation starter questions about hobbies or interests.",
  "Provide 3 unique questions about future goals or aspirations that would be fun to discuss.",
  "Give me 3 creative questions about preferences (like books, movies, food) that reveal personality.",
  "Generate 3 questions about childhood memories that would spark meaningful conversation.",
  "Create 3 hypothetical scenario questions that are fun to answer.",
  "Provide 3 questions about travel or adventure that people would enjoy discussing."
];

export async function GET() {
  try {
    console.log("Suggestion API called");
    
    // Get a random prompt variation and add randomizer to reduce repetition
    const randomIndex = Math.floor(Math.random() * promptVariations.length);
    const selectedPrompt = promptVariations[randomIndex];
    const randomizer = Math.floor(Math.random() * 10000); // Add randomness
    
    const prompt = `${randomizer} ${selectedPrompt} Format your response as a single string with each question separated by '||'. Make sure the questions are 7-10 words each, positive in tone, and suitable for a diverse audience. Avoid personal or sensitive topics. The questions should be intriguing and foster friendly conversation. Don't include any explanations or other text in your response, just the questions separated by '||'.`;
    
    const { text } = await generateText({
      model: google('gemini-1.5-pro-latest'),
      prompt,
      temperature: 0.9, // Higher temperature = more random responses
      maxTokens: 200,
    });
    
    console.log("Gemini response:", text);
    
    // Clean and process the response
    // Remove any extra characters or formatting that might come from the model
    let cleanedText = text.trim();
    
    // Make sure we have exactly 3 questions - if not, provide fallbacks
    const questions = cleanedText.split('||');
    if (questions.length < 3) {
      const fallbackQuestions = [
        "What's a hobby you've recently started?",
        "If you could have dinner with any historical figure, who?",
        "What's a simple thing that brings you joy?"
      ];
      
      // Add fallback questions if we don't have enough
      while (questions.length < 3) {
        questions.push(fallbackQuestions[questions.length]);
      }
      
      // Rebuild the text
      cleanedText = questions.join('||');
    }
    
    // Return the cleaned text
    return JsonResponse(cleanedText, true, 200);
    
  } catch (error: unknown) {
    console.error("Error generating suggestions:", error);
    
    // Return fallback questions in case of error
    const fallbackQuestions = "What's your favorite hobby?||If you could travel anywhere, where would you go?||What's something that made you smile recently?";
    
    // Return fallback questions with success=true so the UI doesn't show an error
    return JsonResponse(fallbackQuestions, true, 200);
  }
}


import { JsonResponse } from '@/lib/helpers';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Define prompt variations by category
const promptVariationsByCategory = {
  // General purpose questions
  general: [
    "Give me 3 friendly conversation starter questions for getting to know someone.",
    "Generate 3 casual questions that are fun to answer and good ice-breakers.",
    "Create 3 interesting questions about everyday life experiences.",
    "Provide 3 light-hearted questions about preferences or opinions.",
    "Generate 3 questions about hobbies or interests that are universally relatable."
  ],
  
  // Romantic themed questions
  romantic: [
    "Give me 3 flirty but respectful questions about ideal dates or romantic experiences.",
    "Create 3 questions about love languages or relationship preferences.",
    "Generate 3 romantic hypothetical scenario questions.",
    "Provide 3 sweet questions about what someone finds attractive in others.",
    "Create 3 questions about romantic ideals or favorite romantic moments."
  ],
  
  // Intellectual/deep questions
  intellectual: [
    "Give me 3 thought-provoking philosophical questions about life purpose.",
    "Create 3 questions that challenge someone's perspective or worldview.",
    "Generate 3 questions about books, ideas, or intellectual interests.",
    "Provide 3 questions that explore someone's values or beliefs.",
    "Create 3 questions about career aspirations or educational interests."
  ],
  
  // Creative/fun questions
  creative: [
    "Give me 3 imaginative hypothetical scenario questions.",
    "Create 3 questions about creative pursuits or artistic interests.",
    "Generate 3 questions about dreams, fantasies, or alternative realities.",
    "Provide 3 questions that ask someone to invent or imagine something.",
    "Create 3 fun 'would you rather' style questions with creative options."
  ]
};

export async function GET(request: Request) {
  try {
    // Get the category from the URL query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'general';
    
    // Use the appropriate prompt variations based on category
    // Default to general if the category doesn't exist
    const promptVariations = promptVariationsByCategory[category as keyof typeof promptVariationsByCategory] 
      || promptVariationsByCategory.general;
    
    console.log(`Suggestion API called for category: ${category}`);
    
    // Get a random prompt variation and add randomizer to reduce repetition
    const randomIndex = Math.floor(Math.random() * promptVariations.length);
    const selectedPrompt = promptVariations[randomIndex];
    const randomizer = Math.floor(Math.random() * 10000); // Add randomness
    
    // Customize instruction slightly based on category
    let categoryInstructions = "";
    if (category === 'romantic') {
      categoryInstructions = "The questions should be flirty but respectful and appropriate. , never give questions that involve anything physical relations be absolutely halal";
    } else if (category === 'intellectual') {
      categoryInstructions = "The questions should be thoughtful and stimulate interesting conversation.";
    } else if (category === 'creative') {
      categoryInstructions = "The questions should be imaginative, fun, and spark creativity.";
    }
    
    const prompt = `${randomizer} ${selectedPrompt} Format your response as a single string with each question separated by '||'. Make sure the questions are 7-10 words each, positive in tone, and suitable for a diverse audience. ${categoryInstructions} Avoid personal or sensitive topics. The questions should be intriguing and foster friendly conversation. Don't include any explanations or other text in your response, just the questions separated by '||'.`;
    
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
      // Category-specific fallback questions
      const fallbackQuestions = {
        general: [
          "What's a hobby you've recently started?",
          "If you could travel anywhere, where would you go?",
          "What's something that made you smile recently?"
        ],
        romantic: [
          "What's your idea of a perfect date?",
          "What romantic gesture do you find most meaningful?",
          "What qualities do you value in a partner?"
        ],
        intellectual: [
          "What book has influenced your thinking the most?",
          "What philosophical question fascinates you the most?",
          "What current issue do you think needs more attention?"
        ],
        creative: [
          "If you could be any fictional character, who would you choose?",
          "What's your most unusual or creative hidden talent?",
          "If you could invent anything, what would it be?"
        ]
      };
      
      // Get the appropriate fallbacks based on category
      const categoryFallbacks = fallbackQuestions[category as keyof typeof fallbackQuestions] 
        || fallbackQuestions.general;
      
      // Add fallback questions if we don't have enough
      while (questions.length < 3) {
        questions.push(categoryFallbacks[questions.length]);
      }
      
      // Rebuild the text
      cleanedText = questions.join('||');
    }
    
    // Return the cleaned text
    return JsonResponse(cleanedText, true, 200);
    
  } catch (error: unknown) {
    console.error("Error generating suggestions:", error);
    
    // Category-specific fallback questions for errors
    const errorFallbacks = {
      general: "What's your favorite hobby?||If you could travel anywhere, where would you go?||What's something that made you smile recently?",
      romantic: "What's your idea of a perfect date?||What romantic movie do you enjoy the most?||What's the most thoughtful gift you've received?",
      intellectual: "What book has changed your perspective recently?||What's a topic you enjoy learning about?||If you could solve one world problem, what would it be?",
      creative: "If you had a superpower, what would it be?||What would you do if you could time travel?||If you could meet any fictional character, who would it be?"
    };
    
    // Get URL to determine category
    let category = 'general';
    try {
      const url = new URL(request.url);
      category = url.searchParams.get('category') || 'general';
    } catch {
      // If URL parsing fails, use general category
    }
    
    // Return appropriate fallback based on category
    const fallbacks = errorFallbacks[category as keyof typeof errorFallbacks] || errorFallbacks.general;
    
    // Return fallback questions with success=true so the UI doesn't show an error
    return JsonResponse(fallbacks, true, 200);
  }
}


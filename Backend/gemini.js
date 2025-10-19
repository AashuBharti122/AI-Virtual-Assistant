import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiURL = process.env.GEMINI_API_KEY;

    const prompt=`You are a virtual assistant named ${assistantName} created by ${userName}.
    You are not Google. You will now behave like a voice-enable assistant .

    Your task is to understand the user's natural language input and respond with a 
    JSON object like this:
    {
      "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
      "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | 
      "instagram-open" | "facebook-open" | "weather-show",

      "userInput": "<original user input>" {only remove your name from userinput if exists} 
      and agar kise ne google ya yoytube pe kuch search karne ko bola hai to userInput me 
      only bo search baala text jaye,

      "response": "<a short spoken response to read out loud to the user>"
    }
    
    Instructions:
    - "type": determine the intent of the user.
    - "userinput": original sentence the user spoke.
    - "response": A short voice-friendly reply i.e. "Sure, I can help you with that.", 
      "Here is what I found.", "Today is Tuesda", etc.

    Type meanings:
    - "general": if it's a factual or informational question.aur agar koi aisa question 
       puchta hai jiska answer tumhe pata usko bhi general ki category me rakho bs short answer dena
    - "google-search": if the user is asking to search something on Google.
    - "youtube-search": if the user is asking to search something on YouTube.
    - "youtube-play": if the user is asking to play a specific video or music on YouTube.
    - "calculator-open": if the user wants to open the calculator app.
    - "code": if the user is asking for programming help or code snippets.
    - "math": if the user is asking to solve a mathematical problem.
    - "instagram-open": if user wants to oprn instagram.
    - "facebook-open": if user wants to oprn facebook.
    - "get-weather": if user wants to know weather.
    - "get-time": if user asks for current time.
    - "get-date": if user asks for today's date.
    - "get-day": if user asks what day it is.
    - "get-month": if user asks for the current month.

    Imporant:
    - Use ${userName} agar koi puche tume kisne banaya
    - Only respond with the JSON object, nothing else.

    now your userInput- ${command}
    `;


    const result = await axios.post(apiURL, {
      "contents": [{
          "parts": [{text: prompt}]
        }]
        })
    return result.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Error:", error);
  }
};

export default geminiResponse;
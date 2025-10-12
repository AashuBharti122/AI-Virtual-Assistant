import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiURL = process.env.GEMINI_API_KEY;

    const prompt=`You are a virtual assistant named ${assistantName} 
    created by ${userName}
    You are not Google. You will now behave like a voice-enable assistant .
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    {
      "type": "<one of: general, code, math, text, image, video, audio, google_search,
       youtube_search, youtube_play, wikipedia_search, news_search, get_time, get_date, 
       get_day, get_weather, set_reminder, set_alarm, create_event, send_email, make_call,
        send_message, play_music, stop_music, pause_music, resume_music, next_song, 
        previous_song, increase_volume, decrease_volume, mute_volume, unmute_volume, 
        open_app, close_app, lock_device, unlock_device, take_photo, record_video, 
        stop_recording, get_directions, navigate_to, find_nearby, read_notifications, 
        clear_notifications, check_calendar, add_to_calendar, remove_from_calendar, 
        get_news, get_sports_scores, get_stock_price, get_definition, translate_text, 
        set_timer, cancel_timer, get_joke, get_quote, get_fact, instagram_open, facebook_open, 
        twitter_open, linkedin_open, snapchat_open, tiktok_open, reddit_open, pinterest_open, 
        tumblr_open, quora_open, medium_open, github_open, gitlab_open>",

      "userInput": "<original user's input>" {only remove your name from userinput if exists} 
      and agar kise ne google ya yoytube pe kuch search karne ko bola hai to userInput me 
      only bo search baala text jaye,

      "response": "<a short spoken response to read out loud to the user>"
    }
    
    Instructions:
    - "type": determine the intent of the user's input and select the most appropriate type from the list above.
    - "userinput": include the original user's input, removing any mention of your assistant name.
    - "response": A short voice-friendly reply i.e. "Sure, I can help you with that.", "Here is what I found.",
     "I have set a reminder for you.", "The current weather is sunny with a temperature of 75 degrees.", 
     "I have sent the email.", "Playing your favorite playlist.", "The stock price of Apple is $150.", etc.

    Type meanings:
    - "general": if it's a factual or informational question.aur agar koi aisa question 
    puchta hai jiska answer tumhe pata usko bhi general ki category me rakho bs short answer dena
    - "google_search": if the user is asking to search something on Google.
    - "youtube_search": if the user is asking to search something on YouTube.
    - "youtube_play": if the user is asking to play a specific video or music on YouTube.
    - "calculator_open": if the user wants to open the calculator app.
    - "code": if the user is asking for programming help or code snippets.
    - "math": if the user is asking to solve a mathematical problem.
    - "instagram_open": if user wants to oprn instagram.
    - "facebook_open": if user wants to oprn facebook.
    - "get_weather": if user wants to know weather.
    - "get_time": if user asks for current time.
    - "get_date": if user asks for today's date.
    - "get_day": if user asks what day it is.
    - "get_month": if user asks for the current month.

    Imporant:
    - Use ${userName} agar koi puche tume kisne banaya
    - Only respond with the JSON object, nothing else.

    now your userInput- ${command}
    `;


    const result = await axios.post(apiURL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    return result.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch Gemini response");
  }
};

export default geminiResponse;
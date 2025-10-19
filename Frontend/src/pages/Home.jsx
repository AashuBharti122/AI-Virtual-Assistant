import React, { useEffect, useRef, useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assets/ai.gif';
import userImg from '../assets/user.gif';
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverURL, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [hem, setHem] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // Logout
  const handleLogout = async () => {
    try {
      const result=await axios.get(`${serverURL}/api/auth/logout`, { withCredentials: true });
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log( error);
    }
  };

  // Start recognition safely
  const startRecognition = () => {
    if (!isSpeakingRef.current || !isRecognizingRef.current){
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start")
    } catch (error) {
      if (error.name !== "InvalidStateError"){
        console.error("Start error: ", error);
      }
    }
  }
}

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice){
      utterance.voice = hindiVoice;
    } 
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if(type==='google-search') {
        const query=encodeURIComponent(userInput)
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if(type==='calculator-open'){
        window.open("https://www.google.com/search?q=calculator", '_blank');
    }
    if(type==='instagram-open'){
        window.open("https://www.instagram.com/", "_blank");
    }
    if(type==='facebook-open'){
        window.open("https://www.facebook.com/", "_blank");
    }
    if(type==='youtube-search' || type==='youtube-play'){
        const encode =encodeURIComponent(userInput);
        window.open(`https://www.youtube.com/results?search_query=${encode}`, "_blank");
    }
    if(type==='get-weather'){
        window.open("https://www.google.com/search?q=weather", "_blank");
    }
  };

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted=true;

    const startTimeout=setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if(e.name!=="InvalidStateError"){
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start()
              console.log("Recognition restarted")
            } catch (e) {
              if(e.name!=="InvalidStateError"){
                console.log(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start()
              console.log("Recognition restarted after error");
            } catch (e) {
              if(e.name!=="InvalidStateError"){
                console.error(e);
              }
            }
          }
        }, 1000);
      }

  setTimeout(() => {
    if (isMounted && !isRecognizingRef.current) {
      try {
        recognition.start()
        console.log("Recognition restarted after error:", err);
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);
};

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
         setAiText("");
         setUserText(transcript);
         recognition.stop();
         isRecognizingRef.current=false;
         setListening(false);
          const data = await getGeminiResponse(transcript);
          handleCommand(data);
          setAiText(data.response);
          setUserText("");
      }
    }

    const greeting=new SpeechSynthesisUtterance(`Hello ${userData.name}, what can i help you with ?`);
    greeting.lang='hi-IN';
    window.speechSynthesis.speak(greeting);
  
    return () => {
      isMounted=false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center gap-5 overflow-hidden'>

      <RiMenuUnfold2Fill className='lg:hidden text-white absolute top-5 right-5 text-2xl' onClick={() => setHem(true)} />

      {/* Mobile menu */}
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000070] backdrop-blur-lg p-5 flex flex-col gap-5 items-start transition-transform duration-500 ${hem ? "translate-x-0" : "translate-x-full"}`}>
        <RxCross1 className='text-white absolute top-5 right-5 text-2xl' onClick={() => setHem(false)} />
        <button className='w-40 h-12 bg-blue-500 text-white rounded-full text-lg' onClick={handleLogout}>Logout</button>
        <button className='w-60 h-12 bg-blue-500 text-white rounded-full text-lg' onClick={() => navigate("/customize")}>Customize Assistant</button>
        <h1 className='text-white mt-4 text-xl'>History</h1>

        <div className='w-full h-96 overflow-auto text-white'>
                 {userData.history?.map((his, index) => (
                      <div key={index} className='block truncate'>
                         {his}
                      </div>
                  ))}
       </div>
      </div>

      <button className='hidden lg:block absolute top-5 right-5 w-40 h-12 bg-blue-500 text-white rounded-full' onClick={handleLogout}>Logout</button>
      <button className='hidden lg:block absolute top-20 right-5 w-60 h-12 bg-blue-500 text-white rounded-full' onClick={() => navigate("/customize")}>Customize your Assistant</button>

      <div className='w-72 h-96 rounded-3xl overflow-hidden shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full w-full object-cover' />
      </div>

      <h1 className='text-white text-2xl font-bold'>I'm your {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-48' />}
      {aiText && <img src={aiImg} alt="" className='w-48' />}
      <h1 className='text-white text-lg font-semibold text-center px-3'>{userText?userText:aiText?aiText : null}</h1>
    </div>
  );
}

export default Home;

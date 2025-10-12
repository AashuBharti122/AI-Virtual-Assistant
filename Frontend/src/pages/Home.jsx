import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverURL, setUserData, getGeminiResponse} = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening]=useState(false);
  const [userText, setUserText]=useState("")
  const [aiText, setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const isRecognizingRef=useRef(false)
  const [hem, setHem]=useState(false)
  const synth=window.SpeechSynthesis

  const handleLogout =async () => {
    try {
      const result = await axios.get(`${serverURL}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  }

  const startRecognition=()=>{
   if(!isSpeakingRef.current && !isRecognizingRef.current){
     try {
      recognitionRef.current?.start();
      consol.log("Recognition requested to start")
      // setListening(true);
    } catch (error) {
      if(error.name!=="InvalisStartError"){
        console.error("Recognition error:", error);
      }
    }
   }
  }
  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    
    utterence.lang='hi-IN';
    const voices=window.speechSynthesis.getVoices()
    const hindiVoice=voices.find(v=>v.lang==='hi-IN');
    if(hindiVoice){
      utterence.voice=hindiVoice
    }
    isSpeakingRef.current=true
    utterence.onend=()=>{
      setAiText("");
      isSpeakingRef.current=false
      setTimeout(()=>{
        startRecognition();
      },800)
    }
    synth.cancel();
    synth.speak(utterence)
  }

  const handleCommand=(data)=>{
    const {type, userInput, response}=data
    speak(response);
    if(type==='google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,`_blank`);
    }
    if(type==='calculator_open'){
      window.open(`https://www.google.com/search?q=calculator`,`_blank`);
    }
    if(type==='instagram_open'){
      window.open(`https://www.instagram.com/`,`_blank`);
    }
    if(type==='facebook_open'){
      window.open(`https://www.facebook.com/`,`_blank`);
    }
    if(type==='get_weather'){
      window.open(`https://www.google.com/search?q=wather`,`_blank`);
    }
    if(type==='youtube_play' || type==='youtube_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,`_blank`);
    }
  }

  useEffect(()=>{
    const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition=new SpeechRecognition();
    recognition.continuous=true;
    recognition.lang='en_US';
    recognition.interimResults=false;

    recognitionRef.current=recognition;
    let isMounted=true

    const startTimeout=setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("Recognition requested to start")
        } catch (e) {
          if(e.name!=="InvalidStateError"){
            console.error(e);
          }
        }
      }
    },1000)

    recognition.onstart=()=>{
      console.log("Recognition Started");
      isRecognizingRef.current=true;
      setListening(true);

    }
     recognition.onend=()=>{
      console.log("Recognition end");
      isRecognizingRef.current=false;
      setListening(false);

      if(isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted")
            } catch (error) {
              if(error.name!=="InvalisStateErroe"){
                console.log(error);
              }
            }
          }
        },1000);
      }
    };

     recognition.onerroe=(event)=>{
      console.warn("Recognition error:",event.error);
      isRecognizingRef.current=false;
      setListening(false);

      if(isMounted && !isSpeakingRef.current && event.error!=="aborted"){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted after error")
            } catch (error) {
              if(error.name!=="InvalisStateErroe"){
                console.log(error);
              }
            }
          }
        },1000);
      }
    };

    recognition.onresult=async (e)=>{
      const transcript=e.results[e.results.length-1][0].transcript.trim();
      console.log("heard: " +transcript)
      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current=false
        setListening(false)
       const data= await getGeminiResponse(transcript);
       handleCommand(data);
       setAiText(data.response)
       setUserText("")
      }
    };
    
      const greeting=new SpeechSynthesisUtterance(`Hello ${userData.name}, what can i help 
        you with?`)
      greeting.lang='hi-IN';
      window.speechSynthesis.speak(greeting);

    return ()=>{
      isMounted=false;
      clearTimeout(startTimeout);
      recognition.stop()
      setListening(false);
      isRecognizingRef.current=false
    }

  },[])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex 
    justify-center items-center flex-col gap-[20px] overflow-hidden'>

      <RiMenuUnfold2Fill className='lg:hidden text-white absolute w-[25px] h-[25px] 
      top-[20px] right-[20px]' onClick={()=>setHem(true)}/>

      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000035] backdrop-blur-lg 
            p-[20px] flex flex-col gap-[20px] items-start transition-transform ${hem? "translate-x-0":"translate-x-100"}`}>

      <RxCross1 className='text-white absolute w-[25px] h-[25px] 
            top-[20px] right-[20px]'onClick={()=>setHem(false)}/>

      <button className='min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold 
            rounded-full text-[20px] 
            cursor-pointer' onClick={handleLogout}> Log Out</button>

       <button className='min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold 
            rounded-full text-[20px] px-[20px] py-[10px] cursor-pointer' onClick={() => 
            navigate("/customize")}> Customize your Assistant</button>   

          <div className='w-full h-[2px] bg-gray-400'></div>  
          <h1 className='text-white font-semibold text-[18px]'>History</h1>
          <div className='w-full h-[400px] overflow-auto flex flex-col gap-[16px]'>
             {userData.history?.map((his)=>(
              <span className='text-gray-200 text-[18px] truncate'>{his}</span>
             ))}
          </div>

      </div>

      <button className='min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold 
            rounded-full absolute hidden lg:block top-[20px] right-[20px] mt-[30px] text-[20px] 
            cursor-pointer' onClick={handleLogout}> Log Out</button>

       <button className='min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold 
            rounded-full absolute hidden lg:block top-[100px] right-[20px] mt-[30px] text-[20px] px-[20px] 
            py-[10px] cursor-pointer' onClick={() => navigate("/customize")}> Customize your Assistant</button>     

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>

      <h1 className='text-white text-[30px] font-bold'>I'm your {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
      {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home;

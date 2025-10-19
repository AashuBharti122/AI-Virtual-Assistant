import React, { useContext } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { LuImagePlus } from "react-icons/lu";
import { useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";


function Customize() {
  const {
    serverURL,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage=(e)=>{
    const file=e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex 
    justify-center items-center flex-col p-[20px]'>

      <MdKeyboardBackspace className='text-white cursor-pointer absolute top-[20px] left-[20px]
        w-[25px] h-[25px]' onClick={()=>navigate("/")}/>

      <h1 className='text-white text-[30px] mb-[40px] text-center font-bold'>
        Select your <span className='text-blue-500'>AI Assistant</span>
      </h1>
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} /> 
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} /> 

          <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020233] border-2 
          border-[#0000ff52] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 
          cursor-pointer hover:border-3 hover:border-white flex justify-center items-center
          ${selectedImage === "input" ? 'border-3 border-white shadow-2xl shadow-blue-950' : null}`} 
          onClick={()=>{
            inputImage.current.click() 
            setSelectedImage("input")
          }}>

             {!frontendImage && <LuImagePlus className='w-[25px] h-[25px] text-white'/>}
             {frontendImage && <img src={frontendImage} className='w-full h-full object-cover'/>}
          </div>

          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      
      </div>

      {selectedImage && <button className='min-w-[150px] h-[55px] bg-blue-500 text-white 
      font-semibold rounded-full mt-[30px] text-[20px] cursor-pointer' 
      onClick={()=>navigate('/customize2')}>Next</button>}
      
    </div>
  )
}

export default Customize

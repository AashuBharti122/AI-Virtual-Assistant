import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function Customize2() {
  const { userData, backendImage, selectedImage, serverURL, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else{
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(`${serverURL}/api/user/update`, formData, { withCredentials: true });
      setLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
      <MdKeyboardBackspace
        className='text-white cursor-pointer absolute top-[20px] left-[20px] w-[25px] h-[25px]'
        onClick={() => navigate("/customize")}
      />

      <h1 className='text-white text-[30px] mb-[40px] text-center font-bold'>
        Enter your <span className='text-blue-500'>AI Assistant's Name</span>
      </h1>

      <input
        type="text"
        placeholder='Enter Assistant Name'
        className='w-full max-w-[600px] h-[60px] bg-transparent border-2 border-white outline-none text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required onChange={(e) => setAssistantName(e.target.value)}  value={assistantName}
      />

      {assistantName && 
        <button
          className='min-w-[350px] h-[55px] bg-blue-500 text-white font-semibold rounded-full mt-[30px] text-[20px] cursor-pointer disabled:opacity-50'
          disabled={loading}
          onClick={()=>{
            handleUpdateAssistant()
          }}>
          {!loading ? 'Finally Created Your Assistant ' : 'Update Assistant'}
        </button>
      }
    </div>
  );
}

export default Customize2;

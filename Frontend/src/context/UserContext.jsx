import React, { createContext } from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverURL = "http://localhost:9000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/current`, { withCredentials: true });
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverURL}/api/user/asktoassistant`, { command }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log("Error getting Gemini response:", error);
      
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverURL,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;


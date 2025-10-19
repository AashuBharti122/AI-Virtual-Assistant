
import React, { useContext, useState } from 'react';
import bgImage from '../assets/authBg.png';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverURL, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Sign In failed. Please try again.");
    }
  };

  return (
    <div
      className='w-full h-[100vh] bg-cover flex justify-center items-center'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        className='w-[90%] h-[600px] max-w-[500px] bg-[#00000029] backdrop-blur
          shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px]
          rounded-lg px-[20px]'
        onSubmit={handleSignIn}
      >
        <h1 className='text-[30px] font-semibold text-white mb-[30px]'>
          Sign In to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder='Email'
          autoComplete="email"
          className='w-full h-[60px] bg-transparent border-2 border-white outline-none text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className='w-full h-[60px] bg-transparent border-2 border-white text-white rounded-full text-[18px] relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            autoComplete="current-password"
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!showPassword && (
            <IoEye
              className='absolute top-[17px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]'
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className='absolute top-[17px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]'
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err && <p className='text-red-500 text-[17px]'>*{err}</p>}

        <button
          type="submit"
          className='min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold rounded-full mt-[30px] text-[20px] cursor-pointer disabled:opacity-50'
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className='text-white text-[18px]'>
          Want to create a new Account?{" "}
          <span
            className='text-blue-400 cursor-pointer'
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;


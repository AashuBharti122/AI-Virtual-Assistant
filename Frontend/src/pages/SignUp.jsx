import React, { useContext, useState } from "react";
import bgImage from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverURL, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverURL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000029] backdrop-blur 
        shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] 
        rounded-lg px-[20px]"
        onSubmit={handleSignUp}
      >
        <h1 className="text-[30px] font-semibold text-white mb-[30px]">
          Register to
          <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[60px] 
            bg-transparent border-2 border-white outline-none text-white placeholder-gray-300 
            px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] bg-transparent 
            border-2 border-white outline-none text-white placeholder-gray-300 px-[20px]
            py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div
          className="w-full h-[60px] bg-transparent border-2 border-white
             text-white rounded-full text-[18px] relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 
                px-[20px] py-[10px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[17px] right-[20px] text-white 
                cursor-pointer w-[25px] h-[25px]"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute top-[17px] right-[20px] text-white 
                cursor-pointer w-[25px] h-[25px]"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err.length > 0 && <p className="text-red-500 text-[17px]">*{err}</p>}

        <button
          className="min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold
             rounded-full mt-[30px] text-[20px] cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-white text-[18px]">
          Already have an account ?
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

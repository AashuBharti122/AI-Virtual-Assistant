
import React, { useContext, useState } from "react";
import bgImage from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverURL, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");

    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        form,
        { withCredentials: true }
      );

      setUserData(result.data);
      navigate("/customize");
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Try again.";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-center bg-cover bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        className="w-[90%] max-w-[500px] h-[600px] bg-[#00000029] backdrop-blur 
        shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] 
        rounded-lg px-[20px]"
        onSubmit={handleSignUp}
      >
        <h1 className="text-[30px] font-semibold text-white mb-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Enter your Name"
          className="w-full h-[60px] bg-transparent border-2 border-white outline-none 
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full h-[60px] bg-transparent border-2 border-white outline-none 
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={form.email}
          onChange={handleChange}
        />

        <div className="w-full h-[60px] bg-transparent border-2 border-white text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            value={form.password}
            onChange={handleChange}
          />

          {showPassword ? (
            <IoEyeOff
              className="absolute top-[17px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-[17px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && <p className="text-red-500 text-[17px]">*{err}</p>}

        <button
          className={`min-w-[150px] h-[60px] bg-blue-500 text-white font-semibold rounded-full mt-[30px] text-[20px] cursor-pointer ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-white text-[18px]">
          Already have an account?{" "}
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

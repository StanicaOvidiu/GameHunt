import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { auth } from "../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const navigate = useNavigate();

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User signed in succcessfully!");
      navigate("/");
    } catch (error) {
      toast.error("Email and password doesn't match");
    }
  };

  return (
    <>
      <div className="bg-atomic h-screen w-screen bg-cover flex items-center justify-center">
        <div className="w-[25%] p-[20px] bg-white">
          <div className="text-3xl mb-[20px] font-roboto">LOGIN</div>
          <form onSubmit={handleLogin} className="flex flex-col">
            <div>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-4 flex-1 min-w-[40%] my-[10px] p-[10px]"
              type="email"
              required
            />
            <div className="mt-2">Password</div>
            <div className="flex flex-wrap">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-4 flex-1 min-w-[40%] my-[10px] p-[10px]"
                type={passwordType}
                required
              />
              <span className="ml-[10px] mt-[25px]" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="w-[40%] border-collapse px-[20px] py-[15px] bg-teal-500 text-white cursor-pointer mt-[20px] mb-[10px]"
            >
              SIGN IN
            </button>
            <div className="my-[15px] mx-0 text-base font-bold cursor-pointer">
              <Link to="/forgotpassword">Don't remember the password ?</Link>
            </div>
            <div className="mx-0 text-base font-bold cursor-pointer">
              <Link to="/signup">Create a new account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SigninPage;

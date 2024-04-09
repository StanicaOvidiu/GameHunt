import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(
        "Error sending password reset email. Please check the email address."
      );
      toast.error("Error sending password reset email:", error.message);
    }
  };

  return (
    <>
      <div className="bg-atomic h-screen w-screen bg-cover flex items-center justify-center">
        <div className="w-[25%] h-[60%] p-[20px] bg-white">
          <div className="text-3xl mb-[30px] font-roboto">Forgot Password</div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-4 flex-1 min-w-[40%] my-[20px] p-[10px]"
              type="email"
              required
            />
            {message && <p>{message}</p>}
            <button
              type="submit"
              className="w-[40%] border-collapse px-[20px] py-[15px] bg-teal-500 text-white cursor-pointer mt-[20px] mb-[10px]"
            >
              RESET PASSWORD
            </button>
          </form>
          <div className="my-[15px] mx-0 text-base font-bold cursor-pointer">
            <Link to="/signin">Remembered password ?</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

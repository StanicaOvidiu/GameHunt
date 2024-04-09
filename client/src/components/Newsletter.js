import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { db } from "../firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const sendEmailNotification = (toEmail) => {
    const templateParams = {
      to_email: toEmail,
    };

    emailjs.send("SERVICE_ID", "TEMPLATE_ID", templateParams, "USER_ID").then(
      (response) => {
        console.log("Email sent successfully:", response);
      },
      (error) => {
        console.error("Email send error:", error);
      }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (email) {
      addDoc(collection(db, "subscribers"), {
        email: email,
        timestamp: serverTimestamp(),
      });

      sendEmailNotification(email);

      setEmail("");
      toast.success("Updates will be sent");
    }
  };
  return (
    <div className="h-[40vh] bg-gray-100 flex items-center justify-center flex-col">
      <div className="text-6xl font-medium mb-5">Newsletter</div>
      <div className="text-xl font-thin mb-5">
        Get timely updates from your favorite products.
      </div>
      <form
        id="newsletter-form"
        onSubmit={submitHandler}
        className="w-[30%] h-[40px] flex justify-between border-1 border-solid border-gray-400"
      >
        <input
          className="mr-3 flex-1 px-2 py-2 border-collapse"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email..."
        />
        <motion.button
          whileTap={{ scale: 1.5 }}
          type="submit"
          className="flex-6 border-1"
        >
          <AiOutlineSend size={25} />
        </motion.button>
      </form>
    </div>
  );
};

export default Newsletter;

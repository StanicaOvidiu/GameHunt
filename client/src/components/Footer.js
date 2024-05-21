import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsTelegram,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div>
      <div className="flex border-black border-t-2">
        <div className="flex flex-1 flex-col p-[20px]">
          <div className="font-roboto text-5xl">About GameHunt</div>
          <div className="mx-0 my-[20px] font-sans font-light">
            GameHunt is a website destined for passionated gamers who want to
            persuade their dreams and live their lives at the fullest in the
            world of video games.
          </div>
          <div className="flex">
            <div className="icon bg-blue-500">
              <BsFacebook />
            </div>
            <div className="icon bg-red-400">
              <BsInstagram />
            </div>
            <div className="icon bg-blue-400">
              <BsTwitter />
            </div>
            <div className="icon bg-cyan-500">
              <BsTelegram />
            </div>
          </div>
        </div>
        <div className="flex-1 p-[20px] ml-[80px]">
          <div className="ml-[80px] text-3xl mb-[30px] font-roboto">
            Useful Links
          </div>
          <ul className="list-none flex flex-wrap">
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/searchscreen">Search</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/wishlist">Wishlist</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/cart">Cart</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/games">Games</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/consoles">Consoles</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/accessories">Accessories</Link>
            </motion.li>
            <motion.li
              whileTap={{ scale: 1.2 }}
              className="w-[50%] mb-[10px] underline-offset-2 hover:underline cursor-pointer"
            >
              <Link to="/terms">Terms</Link>
            </motion.li>
          </ul>
        </div>
        <div className="flex-1 p-[20px]">
          <div className="text-3xl font-roboto ml-[80px] mb-[30px]">
            Contact
          </div>
          <div className="mb-[20px] flex items-start">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.google.com/maps/@44.6829386,26.0305387,17.17z?entry=ttu"
            >
              <ImLocation className="absolute mt-[3px]" />
              <span className="ml-[25px]">Balo Street</span>
            </a>
          </div>
          <div className="mb-[20px] flex items-center">
            <BsFillTelephoneFill className="mr-[10px]" />
            <a href="tel:PHONE_NUM">+40722575495</a>
          </div>
          <div className="mb-[20px] flex items-center">
            <HiMail className="mr-[10px]" size={20} />
            <a href="mailto:contact@gamehunt.dev">contact@gamehunt.dev</a>
          </div>
          <div className="mb-[20px] flex items-center">
            <img src="https://i.ibb.co/Qfvn4z6/payment.png" alt="payments" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-[30px]">
        @Copyright 2023 developed by Stanica Ovidiu. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MainCategoryItem = ({ item }) => {
  return (
    <div className="flex-1 m-[3px] h-[70vh] relative">
      <img
        src={item.img}
        alt="itemimg"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <div className="text-white mb-[20px]">{item.title}</div>
        <Link to={item.goto}>
          <motion.button
            whileTap={{ scale: 1.2 }}
            className="border-collapse p-[10px] bg-white text-black cursor-pointer mb-[50px] font-semibold"
          >
            SHOP NOW
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default MainCategoryItem;

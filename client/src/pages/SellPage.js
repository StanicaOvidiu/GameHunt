import React from "react";
import { Link } from "react-router-dom";

const SellPage = () => {
  return (
    <div>
      <div className="w-[80%] bg-gray-500 rounded-full mt-[15px] mx-[80px] h-2.5 dark:bg-gray-700">
        <div className="bg-green-600 h-2.5 rounded-full w-[0%]"></div>
        <div>0 %</div>
      </div>
      <div className="font-bold text-4xl text-orange-500 ml-[420px] mt-[40px] mb-[20px]">
        What do you want to sell ?
      </div>
      <div className="text-xl ml-[540px] mb-[40px]">Select the product</div>
      <div className="flex group gap-[40px]">
        <Link to="/sell/games">
          <img
            className="flex-1 ml-[100px] rounded-lg border-[4px] w-[350px] border-gray-400 hover:border-orange-500"
            src="https://cdn.gaminggorilla.com/wp-content/uploads/2023/02/The-Most-Popular-Games-to-Play-Right-Now.jpg"
            alt="games"
          />
        </Link>
        <Link to="/sell/consoles">
          <img
            className="flex-1 rounded-lg border-[4px] h-[200px] w-[350px] border-gray-400 hover:border-orange-500"
            src="https://media-cldnry.s-nbcnews.com/image/upload/newscms/2023_09/3596622/230302-gaming-consoles-bd-2x1.jpg"
            alt="consoles"
          />
        </Link>
        <Link to="/sell/accessories">
          <img
            className="flex-1 rounded-lg border-[4px] w-[350px] border-gray-400 hover:border-orange-500"
            src="https://images2.minutemediacdn.com/image/upload/c_crop,w_2071,h_1164,x_0,y_193/c_fill,w_1440,ar_16:9,f_auto,q_auto,g_auto/images/voltaxMediaLibrary/mmsport/mentalfloss/01g8eqh7x3frj93nqfh2.jpg"
            alt="accessories"
          />
        </Link>
      </div>
      <div className="flex my-[20px]">
        <div className="ml-[230px]">Games</div>
        <div className="ml-[320px]">Gaming Consoles</div>
        <div className="ml-[250px]">Gaming Accessories</div>
      </div>
    </div>
  );
};

export default SellPage;

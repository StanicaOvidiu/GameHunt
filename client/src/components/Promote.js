import React from "react";
import { FiTruck } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TbDiscount2 } from "react-icons/tb";
import { MdPolicy } from "react-icons/md";

const Promote = () => {
  return (
    <div className="flex mt-[80px] ml-[100px]">
      <div className="flex justify-between p-[10px] bg-orange-400">
        <FiTruck
          size={30}
          className="mt-[12px] ml-[5px] bg-black p-[5px] rounded-lg text-white"
        />
        <div className="ml-[10px]">
          <div className="font-bold text-xl">Free Shipping</div>
          <div>For All Products</div>
        </div>
      </div>
      <div className="flex justify-between ml-[100px] p-[10px] bg-green-400">
        <TbDiscount2
          size={30}
          className="mt-[12px] ml-[5px] bg-black p-[5px] rounded-lg text-white"
        />
        <div className="ml-[10px]">
          <div className="font-bold text-xl">Big Discounts</div>
          <div>For All Products</div>
        </div>
      </div>
      <div className="flex justify-between ml-[100px] p-[10px] bg-red-400">
        <MdPolicy
          size={30}
          className="mt-[12px] ml-[5px] bg-black p-[5px] rounded-lg text-white"
        />
        <div className="ml-[10px]">
          <div className="font-bold text-xl">Strong Policies</div>
          <div>For All Products</div>
        </div>
      </div>
      <div className="flex justify-between ml-[100px] p-[10px] bg-blue-400">
        <RiSecurePaymentLine
          size={30}
          className="mt-[12px] ml-[5px] bg-black p-[5px] rounded-lg text-white"
        />
        <div className="ml-[10px]">
          <div className="font-bold text-xl">Secure payments</div>
          <div>For All Products</div>
        </div>
      </div>
    </div>
  );
};

export default Promote;

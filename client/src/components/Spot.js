import React from "react";

const Spot = () => {
  return (
    <div className="h-8 bg-black flex text-xl font-light justify-between">
      <div className="pl-32 text-white">
        Phone Order Program: Monday - Friday 10AM - 5PM
      </div>
      <div className="pr-16 text-white">
        <a href="mailto:ordersgamehunt@tzmo-global.com">
          ordersgamehunt@tzmo-global.com
        </a>{" "}
        \ <a href="tel:PHONE_NUM">0742716184</a>
      </div>
    </div>
  );
};

export default Spot;

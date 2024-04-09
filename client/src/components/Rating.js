import React from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const Rating = ({ rating, numReviews }) => {
  return (
    <div>
      <span className="flex items-center">
        {rating >= 1 ? (
          <BsStarFill className=" text-yellow-400" />
        ) : rating >= 0.5 ? (
          <BsStarHalf className=" text-yellow-400" />
        ) : (
          <BsStar className=" text-yellow-400" />
        )}
        {rating >= 2 ? (
          <BsStarFill className=" text-yellow-400" />
        ) : rating >= 1.5 ? (
          <BsStarHalf className=" text-yellow-400" />
        ) : (
          <BsStar className=" text-yellow-400" />
        )}
        {rating >= 3 ? (
          <BsStarFill className=" text-yellow-400" />
        ) : rating >= 2.5 ? (
          <BsStarHalf className=" text-yellow-400" />
        ) : (
          <BsStar className=" text-yellow-400" />
        )}
        {rating >= 4 ? (
          <BsStarFill className=" text-yellow-400" />
        ) : rating >= 3.5 ? (
          <BsStarHalf className=" text-yellow-400" />
        ) : (
          <BsStar className=" text-yellow-400" />
        )}
        {rating >= 5 ? (
          <BsStarFill className=" text-yellow-400" />
        ) : rating >= 4.5 ? (
          <BsStarHalf className=" text-yellow-400" />
        ) : (
          <BsStar className=" text-yellow-400" />
        )}
        <span className="ml-2 font-bold">
          {rating} / 5.0 ({numReviews} reviews)
        </span>
      </span>
    </div>
  );
};

export default Rating;

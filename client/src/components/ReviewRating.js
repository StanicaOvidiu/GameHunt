import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewRating = ({ rating, onRatingChange }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => index + 1);

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <label key={star} className="cursor-pointer">
          <FaStar
            className={`text-2xl ${
              rating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
          />
          <input
            type="radio"
            name="rating"
            value={star}
            checked={rating === star}
            onChange={() => onRatingChange(star)}
            className="ml-[5px] mt-[5px]"
          />
        </label>
      ))}
    </div>
  );
};

export default ReviewRating;

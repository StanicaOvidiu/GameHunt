import React from "react";
import { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { Link } from "react-router-dom";

const Slider = () => {
  const slides = [
    {
      url: "/images/atomic.jpg",
      goto: "/games/playstation/atomic-heart-ps5",
    },

    {
      url: "/images/hogwarts.jpg",
      goto: "/games/playstation/hogwarts-legacy-ps5",
    },

    {
      url: "/images/ragnarok.jpg",
      goto: "/games/playstation/god-of-war-ragnarok-ps4",
    },

    {
      url: "/images/gotham.jpg",
      goto: "/games/xbox/gotham-knights-xboxseriesx",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  function auto() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      auto();
    }
    return () => clearInterval(slideInterval);
    // eslint-disable-next-line
  }, [currentIndex]);

  return (
    <div className="h-[550px] w-full m-auto relative group mb-[30px]">
      <Link to={slides[currentIndex].goto}>
        <div
          style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
          className="w-[100%] h-[100%] bg-center bg-cover duration-500 cursor-pointer"
        ></div>
      </Link>
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsArrowLeftCircle onClick={prevSlide} size={30} />
      </div>
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsArrowRightCircle onClick={nextSlide} size={30} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;

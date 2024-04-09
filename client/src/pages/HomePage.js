import React from "react";
import Slider from "../components/Slider";
import Spot from "../components/Spot";
import TopProducts from "../components/TopProducts";
import MainCategories from "../components/MainCategories";
import Newsletter from "../components/Newsletter";
import Promote from "../components/Promote";

const HomePage = () => {
  return (
    <>
      <Spot />
      <Slider />
      <Promote />
      <MainCategories />
      <TopProducts />
      <Newsletter />
    </>
  );
};

export default HomePage;

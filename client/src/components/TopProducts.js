import React from "react";
import TopProductsItem from "./TopProductsItem";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import Loader from "./Loader";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const querySnapshot = await getDocs(productsCollectionRef);

        const productsData = querySnapshot.docs.map((doc) => ({
          ids: doc.ids,
          ...doc.data(),
        }));

        const productsWithReviews = await Promise.all(
          productsData.map(async (product) => {
            const reviewsQuerySnapshot = await getDocs(
              query(
                collection(db, "reviews"),
                where("productId", "==", product.ids)
              )
            );

            const reviewsData = reviewsQuerySnapshot.docs.map((reviewDoc) =>
              reviewDoc.data()
            );
            const averageRating = calculateAverageRating(reviewsData);

            return { ...product, reviews: reviewsData, averageRating };
          })
        );

        const sortedProducts = productsWithReviews.sort(
          (a, b) => b.averageRating - a.averageRating
        );

        setProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Fetching products failed!");
      }
    };

    fetchTopProducts();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return 0;
    }

    const totalRatingSum = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    return totalRatingSum / reviews.length;
  };

  return (
    <>
      <div className="font-roboto text-6xl justify-center flex mt-5">
        Top products
      </div>
      <div className="p-[20px] flex flex-wrap justify-between">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="p-[20px] bg-red-500 text-white">{error}</div>
        ) : (
          <>
            <TopProductsItem
              val="games/playstation"
              item={products[0]}
              key={products[0].ids}
              place="1"
            />
            <TopProductsItem
              val="games/playstation"
              item={products[1]}
              key={products[1].ids}
              place="2"
            />
            <TopProductsItem
              val="games/xbox"
              item={products[2]}
              key={products[2].ids}
              place="3"
            />
            <TopProductsItem
              val="games/pc"
              item={products[3]}
              key={products[3].ids}
              place="4"
            />
            <TopProductsItem
              val="games/nintendo"
              item={products[4]}
              key={products[4].ids}
              place="5"
            />
          </>
        )}
      </div>
    </>
  );
};

export default TopProducts;

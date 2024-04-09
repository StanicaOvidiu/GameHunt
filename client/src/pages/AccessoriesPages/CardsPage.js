import React, { useEffect, useState } from "react";
import ProductsCard from "../../components/ProductsCard";
import Loader from "../../components/Loader";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";

const CardsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("All");
  const [sortValue, setSortValue] = useState("None");

  const calculateAverageRating = (reviewsData) => {
    if (reviewsData.length === 0) {
      return 0;
    }

    const totalRating = reviewsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / reviewsData.length;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const q = query(
          productsCollectionRef,
          where("category", "==", "Accessories"),
          where("brand", "==", "Gift Cards")
        );
        const querySnapshot = await getDocs(q);

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

        setProducts(productsWithReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Fetching products failed!");
      }
    };

    fetchProducts();
  }, []);

  let filteredProducts = [...products];

  if (filterValue !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.brandType === filterValue
    );
  }

  if (sortValue === "nameAsc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "nameDesc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortValue === "priceAsc") {
    filteredProducts.sort((a, b) => a.sell_price - b.sell_price);
  } else if (sortValue === "priceDesc") {
    filteredProducts.sort((a, b) => b.sell_price - a.sell_price);
  } else if (sortValue === "ratingAsc") {
    filteredProducts.sort((a, b) => a.averageRating - b.averageRating);
  } else if (sortValue === "ratingDesc") {
    filteredProducts.sort((a, b) => b.averageRating - a.averageRating);
  }

  return (
    <div className="py-[20px]">
      <div className="mt-[15px] mb-[20px] ml-[70px] text-orange-500">
        <Link to="/"> Home </Link>/
        <Link to={`/accessories`}> Accessories </Link>/ Gift Cards
      </div>
      <div className="ml-[80px] mb-[20px]">
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="border-2 border-black mr-[30px]"
        >
          <option value="all">Filter By Brand</option>
          <option value="Playstation">Playstation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
          <option value="PC">PC</option>
        </select>
        <select
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="border-2 border-black"
        >
          <option value="all">Sort By</option>
          <option value="nameAsc">Alphabetically, A-Z</option>
          <option value="nameDesc">Alphabetically, Z-A</option>
          <option value="priceAsc">Low Price</option>
          <option value="priceDesc">High Price</option>
          <option value="ratingAsc">Low Rating</option>
          <option value="ratingDesc">High Rating</option>
        </select>
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl bg-black text-white py-2 w-80 text-center">
          Gift Cards
        </h1>
        <span className="w-20 h-[3px] bg-black" />
      </div>
      <div className="max-w-screen-xl mx-auto py-10 grid grid-cols-4 gap-10">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="p-[20px] bg-red-500 text-white">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <h1>No products are found!</h1>
        ) : (
          filteredProducts.map((item) => (
            <ProductsCard val="accessories/cards" item={item} key={item.ids} />
          ))
        )}
      </div>
    </div>
  );
};

export default CardsPage;

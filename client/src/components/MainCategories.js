import React from "react";
import MainCategoriesItem from "./MainCategoriesItem";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import Loader from "./Loader";

const MainCategories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "mainData");
        const q = query(
          productsCollectionRef,
          where("category", "==", "Categories")
        );

        const querySnapshot = await getDocs(q);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        productsData.sort((a, b) => (a.id < b.id ? -1 : 1));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Fetching products failed!");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="font-roboto text-6xl justify-center flex mt-[60px]">
        Main Categories
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="p-[20px] bg-red-500 text-white">{error}</div>
      ) : (
        <div className="flex pb-[20px] mt-[30px] justify-between">
          {products.map((item, index) => (
            <MainCategoriesItem item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainCategories;

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase.config";

const ConsolesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "mainData");
        const q = query(
          productsCollectionRef,
          where("category", "==", "Consoles")
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
    <div className="flex p-[20px] mt-[10px] justify-between">
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="p-[20px] bg-red-500 text-white">{error}</div>
      ) : (
        products.map((item) => (
          <div key={item.id} className="flex-1 m-[3px] h-[70vh] relative">
            <img
              src={item.img}
              alt="itemimg"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <div className="text-white mb-[20px]">{item.title}</div>
              <Link to={item.goto}>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="border-collapse p-[10px] bg-white text-black cursor-pointer mt-[300px] font-semibold"
                >
                  SHOP NOW
                </motion.button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConsolesPage;

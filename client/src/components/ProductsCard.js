import React, { useState, useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "./Rating";
import { db, auth } from "../firebase.config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const ProductsCard = ({ item, val }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [productRating, setProductRating] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProductRating = async () => {
      try {
        const reviewsCollectionRef = collection(db, "reviews");
        const q = query(
          reviewsCollectionRef,
          where("productId", "==", item.ids)
        );
        const querySnapshot = await getDocs(q);

        let totalRatingSum = 0;
        let numReviews = 0;

        querySnapshot.forEach((doc) => {
          const reviewData = doc.data();
          totalRatingSum += reviewData.rating;
          numReviews++;
        });

        if (numReviews > 0) {
          const averageRating = totalRatingSum / numReviews;
          setProductRating(averageRating);
        }
      } catch (error) {
        console.error("Error fetching product rating:", error);
      }
    };

    fetchProductRating();
  }, [item.ids]);

  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("You need to log in to add items to your cart.");
      return;
    }

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().cart;
      }

      const existingCartItemIndex = updatedCart.findIndex(
        (item) => item.ids === product.ids
      );

      if (existingCartItemIndex !== -1) {
        updatedCart[existingCartItemIndex].quantity += 1;
      } else {
        updatedCart.push({
          ids: product.ids,
          name: product.name,
          sell_price: product.sell_price,
          quantity: 1,
          image: product.image,
          category: product.category,
          brand: product.brand,
          slug: product.slug,
        });
      }

      await setDoc(cartRef, { cart: updatedCart });

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }
  };

  return (
    <div className="relative group">
      <div className="w-full h-96 cursor-pointer overflow-hidden">
        <Link to={`/${val}/${item.slug}`}>
          <img
            className="w-full h-full object-contain group-hover:scale-110 duration-500"
            src={item.image}
            alt="ProductImage"
          />
        </Link>
      </div>
      <div className="w-full border-[1px] px-2 py-4 group">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold">
              {item.name.substring(0, 15)}
            </h2>
          </div>
          <div className="flex justify-end gap-2 overflow-hidden w-24 text-sm">
            <div className="flex gap-2 transform group-hover:translate-x-24 transition-transform duration-500">
              {item.old_price > 0 && (
                <div className="font-semibold line-through text-red-500">
                  ${item.old_price}
                </div>
              )}
            </div>
            <div
              onClick={() => addToCart(item)}
              className="absolute z-20 w-[100px] text-gray-500 hover:text-gray-900 flex invisible group-hover:visible items-center gap-1 hover:inline-flex top-[403px] transform -translate-x-[40px] group-hover:translate-x-0 transition-transform cursor-pointer duration-500"
            >
              Add to cart{" "}
              <span>
                <BsArrowRight />
              </span>
            </div>
          </div>
        </div>
        <div>
          <div>
            {" "}
            <div className="flex justify-between items-center overflow-hidden">
              {item.brand}
              <div className="flex gap-2 transform group-hover:translate-x-24 transition-transform duration-500">
                <div className="font-semibold">${item.sell_price}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span>
            <div>{item.brandType}</div>
            <Rating
              rating={productRating.toFixed(2)}
              numReviews={item.numReviews}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;

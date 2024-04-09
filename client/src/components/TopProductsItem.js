import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { db, auth } from "../firebase.config";
import { setDoc, getDoc, doc } from "firebase/firestore";

const TopProductsItem = ({ item, val, place }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

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

  const handleWishlist = async () => {
    if (!currentUser) {
      toast.error("You need to log in to add items to your wishlist.");
      return;
    }

    const wishlistRef = doc(db, "wishlist", currentUser.uid);

    try {
      const wishlistDoc = await getDoc(wishlistRef);
      const wishlistData = wishlistDoc.exists()
        ? wishlistDoc.data()
        : { wishlist: [] };

      let updatedWishlist;
      if (isInWishlist) {
        updatedWishlist = wishlistData.wishlist.filter(
          (product) => product.ids !== item.ids
        );
        toast.error("Item removed from wishlist");
      } else {
        updatedWishlist = [
          ...wishlistData.wishlist,
          {
            ids: item.ids,
            name: item.name,
            sell_price: item.sell_price,
            image: item.image,
            category: item.category,
            brand: item.brand,
            slug: item.slug,
          },
        ];
        toast.success("Item added to wishlist");
      }

      await setDoc(wishlistRef, { wishlist: updatedWishlist });

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Error adding/removing from wishlist:", error);
    }
  };

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

      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }
  };

  return (
    <div className="container" key={item.ids}>
      <div className="w-[200px] h-[200px] rounded-xl bg-white absolute" />
      <img src={item.image} alt="games" className="h-[70%] z-20" />
      <div className="info">
        <motion.button
          onClick={() => addToCart(item)}
          whileTap={{ scale: 1.5 }}
          className="icon2"
        >
          <AiOutlineShoppingCart size={30} />
        </motion.button>
        <motion.button whileTap={{ scale: 1.5 }} className="icon2">
          <Link to={`/${val}/${item.slug}`}>
            <AiOutlineSearch size={30} />
          </Link>
        </motion.button>
        <motion.button
          onClick={() => handleWishlist()}
          whileTap={{ scale: 1.5 }}
          className="icon2"
        >
          {isInWishlist ? (
            <AiFillHeart size={30} />
          ) : (
            <AiOutlineHeart size={30} />
          )}
        </motion.button>
      </div>
      <div className="bg-black rounded-full p-2 font-roboto text-white absolute bottom-0 mt-[30px] text-2xl">
        {place}.
      </div>
    </div>
  );
};

export default TopProductsItem;

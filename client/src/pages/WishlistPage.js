import WishlistItem from "../components/WishlistItem";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { auth, db } from "../firebase.config";
import { doc, onSnapshot } from "firebase/firestore";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        const wishlistRef = doc(db, "wishlist", user.uid);
        onSnapshot(wishlistRef, (snapshot) => {
          const wishlistData = snapshot.data();
          if (wishlistData) {
            setWishlist(wishlistData.wishlist);
          } else {
            setWishlist([]);
          }
        });
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="bg-wishimg w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[560px] text-7xl font-extrabold tracking-wider text-white">
          Wishlist
        </div>
      </div>
      {currentUser ? (
        <div>
          {wishlist && wishlist.length > 0 ? (
            <div className="max-w-screen-xl mx-auto py-[60px] flex">
              <WishlistItem />
            </div>
          ) : (
            <div className="max-w-screen-xl mx-auto py-10 flex flex-col items-center gap-2 justify-center">
              <p className="text-xl text-orange-600 font-titleFont font-semibold">
                Your Wishlist is Empty. Please go back to Shopping and add
                products to Wishlist.
              </p>
              <Link to="/">
                <button className="flex items-center gap-1 text-gray-400 hover:text-black duration-300">
                  <span>
                    <HiOutlineArrowLeft />
                  </span>
                  Go back Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="p-[20px] bg-red-500 text-white my-[30px] text-2xl">
            Please log in to view your wishlist.
          </div>
          <Link to="/">
            <button className="flex items-center gap-1 mb-[20px] text-gray-400 hover:text-black duration-300">
              <span>
                <HiOutlineArrowLeft />
              </span>
              Go back Shopping
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default WishlistPage;

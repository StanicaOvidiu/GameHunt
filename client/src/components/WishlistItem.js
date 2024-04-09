import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase.config";
import { doc, updateDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WishlistItem = () => {
  const [wishlist, setWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentStartDate, setRentStartDate] = useState(null);
  const [rentEndDate, setRentEndDate] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);

        const wishlistRef = doc(db, "wishlist", user.uid);
        onSnapshot(wishlistRef, (snapshot) => {
          const wishlistData = snapshot.data();
          if (wishlistData) {
            setWishlist(wishlistData.wishlist);
          } else {
            setWishlist(null);
          }
        });
      } else {
        setCurrentUser(null);
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFromWishlist = async (itemId) => {
    if (!currentUser) {
      return;
    }

    const wishlistRef = doc(db, "wishlist", currentUser.uid);

    try {
      const wishlistDoc = await getDoc(wishlistRef);
      const updatedWishlist = wishlistDoc
        .data()
        .wishlist.filter((item) => item.ids !== itemId);
      await updateDoc(wishlistRef, { wishlist: updatedWishlist });

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const resetWishlist = async () => {
    if (!currentUser) {
      return;
    }

    const wishlistRef = doc(db, "wishlist", currentUser.uid);

    try {
      await updateDoc(wishlistRef, { wishlist: [] });

      setWishlist([]);
    } catch (error) {
      console.error("Error resetting wishlist:", error);
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

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }
  };

  const handleRentButtonClick = async (product) => {
    if (!currentUser) {
      toast.error("You need to log in to rent this product.");
      return;
    }

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const isProductInCart = cartData.cart.some(
          (item) => item.ids === product?.ids
        );

        if (isProductInCart) {
          toast.error(
            "This product is already in your cart and cannot be rented."
          );
        } else {
          setSelectedProduct(product);
          setShowDatePicker(!showDatePicker);
        }
      } else {
        setSelectedProduct(product);
        setShowDatePicker(!showDatePicker);
      }
    } catch (error) {
      console.error("Error checking cart:", error);
      toast.error("An error occurred while checking your cart.");
    }
  };

  const handleConfirmRent = async () => {
    if (!selectedProduct) {
      return;
    }

    if (!rentStartDate || !rentEndDate) {
      toast.error("Please select rental dates.");
      return;
    }

    const rentalDuration = Math.ceil(
      (rentEndDate - rentStartDate) / (1000 * 60 * 60 * 24)
    );

    if (rentalDuration <= 0) {
      toast.error("Please select valid rental dates.");
      return;
    }

    if (!currentUser) {
      toast.error("You need to log in to rent this product.");
      return;
    }

    const rentedProduct = {
      ids: selectedProduct.ids,
      name: selectedProduct.name,
      rent_price: selectedProduct.rent_price,
      quantity: 1,
      days: rentalDuration,
      image: selectedProduct.image,
      category: selectedProduct.category,
      brand: selectedProduct.brand,
      slug: selectedProduct.slug,
    };

    try {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartDoc = await getDoc(cartRef);

      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().cart;
      }

      const existingCartItemIndex = updatedCart.findIndex(
        (item) => item.ids === rentedProduct.ids
      );

      if (existingCartItemIndex !== -1) {
        updatedCart[existingCartItemIndex].quantity += rentedProduct.quantity;
      } else {
        updatedCart.push(rentedProduct);
      }

      await setDoc(cartRef, { cart: updatedCart });

      toast.success(
        `${selectedProduct.name} added to cart for ${rentalDuration} days.`
      );

      setSelectedProduct(null);
      setShowDatePicker(false);
      setRentStartDate(null);
      setRentEndDate(null);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart.");
    }
  };

  return (
    <div className="w-[80%] pr-10">
      <div className="w-full">
        <h2 className="font-titleFont text-2xl">Wishlist</h2>
        <div className="mt-[20px] mb-[50px]">
          <span className="mx-[60px] font-extrabold">Image</span>
          <span className="ml-[70px] font-extrabold">Name</span>
          <span className="ml-[200px] font-extrabold">Price</span>
        </div>
        <div>
          <div>
            {wishlist.map((item) => (
              <div
                key={item.ids}
                className="flex items-center justify-between gap-6 mt-6"
              >
                <div className="flex items-center gap-2">
                  <MdOutlineClose
                    onClick={() =>
                      removeFromWishlist(item.ids) &
                      toast.error(`${item.name} is removed`)
                    }
                    className="text-xl text-gray-600 hover:text-red-600 cursor-pointer duration-300"
                  />
                  <Link
                    to={`/${item.category.toLowerCase()}/${item.brand.toLowerCase()}/${item.slug.toLowerCase()}`}
                  >
                    <img
                      className="w-32 h-32 object-contain"
                      src={item.image}
                      alt="productImg"
                    />
                  </Link>
                </div>
                <h2 className="w-52">{item.name}</h2>
                <p className="w-10">${item.sell_price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-black text-white py-3 px-6 ml-[50px] active:bg-gray-800"
                >
                  Add to cart{" "}
                </button>
                <button
                  onClick={() => handleRentButtonClick(item)}
                  className="bg-black text-white py-3 px-6 ml-[50px] active:bg-gray-800"
                >
                  Rent
                </button>
              </div>
            ))}
            {showDatePicker && selectedProduct && (
              <div className="mt-4 ml-7">
                <h3 className="text-lg font-semibold mb-2">Rental Dates</h3>
                <div className="flex gap-2">
                  <DatePicker
                    selected={rentStartDate}
                    onChange={(date) => setRentStartDate(date)}
                    selectsStart
                    startDate={rentStartDate}
                    endDate={rentEndDate}
                    minDate={new Date()}
                    placeholderText="Start Date"
                  />
                  <DatePicker
                    selected={rentEndDate}
                    onChange={(date) => setRentEndDate(date)}
                    selectsEnd
                    startDate={rentStartDate}
                    endDate={rentEndDate}
                    minDate={rentStartDate || new Date()}
                    placeholderText="End Date"
                  />
                </div>
                <button
                  onClick={handleConfirmRent}
                  className="bg-black text-white py-3 px-6 mt-3 active:bg-gray-800"
                >
                  Confirm Rental
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => resetWishlist() & toast.error("Your Cart is Empty!")}
            className="bg-red-500 text-white mt-8 ml-7 py-1 px-6 hover:bg-red-800 duration-300"
          >
            Reset Wishlist
          </button>
        </div>
      </div>
      <Link to="/">
        <button className="mt-8 ml-7 flex items-center gap-1 text-gray-400 hover:text-black duration-300">
          <span>
            <HiOutlineArrowLeft />
          </span>
          Go back Shopping
        </button>
      </Link>
    </div>
  );
};

export default WishlistItem;

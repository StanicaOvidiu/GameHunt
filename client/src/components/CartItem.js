import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase.config";
import {
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const CartItem = () => {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        const cartRef = doc(db, "cart", user.uid);
        onSnapshot(cartRef, (snapshot) => {
          const cartData = snapshot.data();
          if (cartData) {
            setCart(cartData.cart);
          } else {
            setCart([]);
          }
        });
      } else {
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    const updatedCart = cart.filter((item) => item.ids !== itemId);
    setCart(updatedCart);

    if (currentUser) {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data();
        const updatedFirestoreCart = cartData.cart.filter(
          (item) => item.ids !== itemId
        );
        await updateDoc(cartRef, { cart: updatedFirestoreCart });
      }
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.ids === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);

    if (currentUser) {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data();
        const updatedFirestoreCart = cartData.cart.map((item) =>
          item.ids === itemId ? { ...item, quantity: newQuantity } : item
        );
        await updateDoc(cartRef, { cart: updatedFirestoreCart });
      }
    }
  };

  const handleDaysChange = async (itemId, newDays) => {
    const updatedCart = cart.map((item) =>
      item.ids === itemId ? { ...item, days: newDays } : item
    );
    setCart(updatedCart);

    if (currentUser) {
      const cartRef = doc(db, "cart", currentUser.uid);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data();
        const updatedFirestoreCart = cartData.cart.map((item) =>
          item.ids === itemId ? { ...item, days: newDays } : item
        );
        await updateDoc(cartRef, { cart: updatedFirestoreCart });
      }
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const itemToUpdate = cart.find((item) => item.ids === itemId);
    if (itemToUpdate && itemToUpdate.quantity > 1) {
      const newQuantity = itemToUpdate.quantity - 1;
      handleQuantityChange(itemId, newQuantity);
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    const itemToUpdate = cart.find((item) => item.ids === itemId);
    if (itemToUpdate) {
      const newQuantity = itemToUpdate.quantity + 1;
      handleQuantityChange(itemId, newQuantity);
    }
  };

  const handleDecreaseDays = (itemId) => {
    const itemToUpdate = cart.find((item) => item.ids === itemId);
    if (itemToUpdate && itemToUpdate.days > 1) {
      const newDays = itemToUpdate.days - 1;
      handleDaysChange(itemId, newDays);
    }
  };

  const handleIncreaseDays = (itemId) => {
    const itemToUpdate = cart.find((item) => item.ids === itemId);
    if (itemToUpdate) {
      const newDays = itemToUpdate.days + 1;
      handleDaysChange(itemId, newDays);
    }
  };

  const handleResetCart = async () => {
    setCart([]);

    if (currentUser) {
      const cartRef = doc(db, "cart", currentUser.uid);
      await deleteDoc(cartRef);
    }
  };

  return (
    <div className="w-2/3 pr-10">
      <div className="w-full">
        <h2 className="font-titleFont text-2xl">Shopping Cart</h2>
        <div className="mt-[20px] mb-[50px]">
          <span className="mx-[50px] font-extrabold">Image</span>
          <span className="ml-[70px] font-extrabold">Name</span>
          <span className="ml-[90px] font-extrabold">Price</span>
          <span className="ml-[80px] font-extrabold">Quantity/Days</span>
          <span className="ml-[100px] font-extrabold">Total Price</span>
        </div>
        {currentUser ? (
          <div>
            <div>
              {cart.map((item) => (
                <div
                  key={item.ids}
                  className="flex items-center justify-between gap-6 mt-6"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineClose
                      onClick={() =>
                        handleRemoveFromCart(item.ids) &&
                        toast.error(`${item.name} is removed`)
                      }
                      className="text-xl text-gray-600 hover:text-red-600 cursor-pointer duration-300"
                    />
                    <Link to={`/${item.category}/${item.brand}/${item.slug}`}>
                      <img
                        className="w-32 h-32 object-contain"
                        src={item.image}
                        alt="productImg"
                      />
                    </Link>
                  </div>
                  <Link to={`/${item.category}/${item.brand}/${item.slug}`}>
                    <h2 className="w-[80px]">{item.name}</h2>
                  </Link>
                  {item.sell_price ? (
                    <>
                      <p className="w-10">${item.sell_price}</p>
                      <div className="w-52 flex items-center justify-between text-gray-500 gap-4 border p-3">
                        <p className="text-sm">Quantity</p>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                          <button
                            onClick={() => handleDecreaseQuantity(item.ids)}
                            className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                          >
                            -
                          </button>
                          {item.quantity}
                          <button
                            onClick={() => handleIncreaseQuantity(item.ids)}
                            className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="w-14">
                        ${(item.quantity * item.sell_price).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <>
                      {item.rent_price && (
                        <>
                          <p className="w-10">${item.rent_price}</p>
                          <div className="w-52 flex items-center justify-between text-gray-500 gap-4 border p-3">
                            <p className="text-sm">Days</p>
                            <div className="flex items-center gap-4 text-sm font-semibold">
                              <button
                                onClick={() => handleDecreaseDays(item.ids)}
                                className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                              >
                                -
                              </button>
                              {item.days}
                              <button
                                onClick={() => handleIncreaseDays(item.ids)}
                                className="border h-5 font-normal text-lg flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer duration-300 active:bg-black"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <p className="w-14">
                            ${(item.days * item.rent_price).toFixed(2)}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                handleResetCart() && toast.success("Cart is empty")
              }
              className="bg-red-500 text-white mt-8 ml-7 py-1 px-6 hover:bg-red-800 duration-300"
            >
              Reset Cart
            </button>
          </div>
        ) : (
          <p>Log in</p>
        )}
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

export default CartItem;

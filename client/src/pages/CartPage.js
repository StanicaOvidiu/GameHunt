import CartItem from "../components/CartItem";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase.config";
import { onSnapshot, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellTotal, setSellTotal] = useState(0);
  const [rentTotal, setRentTotal] = useState(0);

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

  useEffect(() => {
    let sellTotalPrice = 0;
    let rentTotalPrice = 0;

    cart.forEach((item) => {
      if (item.sell_price) {
        sellTotalPrice += item.quantity * item.sell_price;
      } else if (item.rent_price) {
        rentTotalPrice += item.days * item.rent_price;
      }
    });

    setSellTotal(sellTotalPrice);
    setRentTotal(rentTotalPrice);
  }, [cart]);

  return (
    <div>
      <div className="bg-cartimg w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[650px] text-7xl font-extrabold tracking-wider text-white">
          Cart
        </div>
      </div>
      {currentUser ? (
        <>
          {cart.length > 0 ? (
            <div className="max-w-screen-xl mx-auto py-[60px] flex">
              <CartItem cart={cart} />
              <div className="w-1/3 bg-[#fafafa] py-6 px-4">
                <div className="flex flex-col gap-6 broder-b-[1px] border-b-gray-400 pb-6">
                  <h2 className="text-2xl font-medium">Cart Total</h2>
                  <p className="flex items-center gap-4 text-base">
                    Subtotal{" "}
                    <span className="font-bold text-lg">
                      ${(sellTotal + rentTotal).toFixed(2)}
                    </span>
                  </p>
                  <p className="flex items-start gap-4 text-base">
                    Shipping <span>Free</span>
                  </p>
                </div>
                <p>
                  {" "}
                  Total{" "}
                  <span className="text-xl font-bold ml-3">
                    ${(sellTotal + rentTotal).toFixed(2)}
                  </span>
                </p>
                <Link to="/shipping">
                  <button className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300">
                    Proceed to Shipping
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-screen-xl mx-auto py-10 flex flex-col items-center gap-2 justify-center">
              <p className="text-xl text-orange-600 font-titleFont font-semibold">
                Your Cart is Empty. Please go back to Shopping and add products
                to Cart.
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
        </>
      ) : (
        <>
          <div className="p-[20px] bg-red-500 text-white my-[30px] text-2xl">
            Please log in to view your cart.
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

export default CartPage;

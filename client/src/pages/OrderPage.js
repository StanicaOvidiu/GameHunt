import React, { useState, useEffect } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import CountDownTimer from "../components/CountDownTimer";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userUID", "==", user.uid));
        onSnapshot(q, (snapshot) => {
          const orderData = [];
          snapshot.forEach((doc) => {
            orderData.push(doc.data());
          });
          orderData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
          setOrders(orderData);
        });
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="bg-orders w-full h-[300px] object-cover">
        <div className="pt-[140px] pl-[560px] text-7xl font-extrabold tracking-wider text-white">
          Orders
        </div>
      </div>
      <div className="w-2/3 pr-10 ml-[100px]">
        <h2 className="font-titleFont font-bold text-4xl mb-[50px] mt-[50px]">
          All Orders
        </h2>
        {user && orders.length > 0 ? (
          orders.map((item, index) => (
            <div key={index} className="flex mb-[30px]">
              <div className="mt-[100px] mr-[30px]">{index + 1}.</div>
              <div className="border p-4 mb-4">
                <div className="mb-[20px]">
                  <div className="font-semibold">Shipping:</div> {item.address},{" "}
                  {item.city}, {item.county}, {item.country}
                </div>
                <div className="mb-[20px]">
                  <div className="font-semibold">Payment Method:</div>{" "}
                  {item.paymentMethod}
                </div>
                <div className="mb-[20px]">
                  <div className="font-semibold">Purchase date:</div>{" "}
                  {formatTimestamp(item.timestamp)}
                </div>
                <div className="font-semibold mb-[20px]">Products:</div>
                <div>
                  <span className="ml-[40px] font-black">Name</span>{" "}
                  <span className="ml-[220px] font-black">Quantity/Days</span>
                  <span className="ml-[100px] font-black">Price</span>
                </div>
                {item.cart && item.cart.length > 0 ? (
                  item.cart.map((cartItem, cartIndex) => (
                    <div key={cartIndex} className="flex items-center mt-6">
                      <div className="mr-[20px]">{cartIndex + 1}.</div>
                      <p className="w-[200px] mr-[100px]">{cartItem.name}</p>
                      {cartItem.sell_price ? (
                        <>
                          <p className="w-[100px] mr-[100px]">
                            Quantity: {cartItem.quantity}
                          </p>
                          <p className="w-[100px]">
                            $
                            {(cartItem.quantity * cartItem.sell_price).toFixed(
                              2
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="w-[100px] mr-[100px]">
                            Days: {cartItem.days}
                          </p>
                          <p className="w-[100px]">
                            ${(cartItem.days * cartItem.rent_price).toFixed(2)}
                          </p>
                          {cartItem.rent_price && (
                            <CountDownTimer
                              days={cartItem.days}
                              itemId={cartItem.ids}
                              userUID={user.uid}
                              userEmail={user.email}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No items in cart.</p>
                )}
                <div className="mt-[40px] font-bold text-lg">
                  Total Price: $
                  {item.cart
                    ? item.cart
                        .reduce((total, cartItem) => {
                          if (cartItem.sell_price) {
                            return (
                              total + cartItem.quantity * cartItem.sell_price
                            );
                          } else {
                            return total + cartItem.days * cartItem.rent_price;
                          }
                        }, 0)
                        .toFixed(2)
                    : 0}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="mb-[30px]">No orders available.</p>
        )}
      </div>
    </>
  );
};

export default OrderPage;

import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  where,
  query,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db, auth } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [sellTotal, setSellTotal] = useState(0);
  const [rentTotal, setRentTotal] = useState(0);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const ordersRef = doc(db, "shipping", user.uid);
        onSnapshot(ordersRef, (snapshot) => {
          const orderData = snapshot.data();
          if (orderData) {
            setOrder(orderData.order);
            setPaymentMethod(orderData.order[0].paymentMethod);
            if (orderData.order[0].cart) {
              setCart(orderData.order[0].cart);
            } else {
              setCart([]);
            }
          } else {
            setOrder([]);
            setCart([]);
          }
        });
      } else {
        setOrder([]);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCashPayment = async () => {
    if (paymentMethod === "Cash") {
      const primaryOrdersCollection = collection(db, "orders");
      const totalAmount = sellTotal + rentTotal;
      const orderToSave = {
        ...order[0],
        timestamp: serverTimestamp(),
        userUID: user.uid,
        totalAmount,
      };

      for (const cartItem of cart) {
        const productQuery = query(
          collection(db, "products"),
          where("name", "==", cartItem.name),
          where("category", "==", cartItem.category)
        );

        const productQuerySnapshot = await getDocs(productQuery);
        const matchingProducts = [];

        productQuerySnapshot.forEach((doc) => {
          matchingProducts.push(doc);
        });

        if (matchingProducts.length === 1) {
          const productRef = matchingProducts[0].ref;
          const productData = matchingProducts[0].data();
          const newStock = { ...productData };

          if (cartItem.sell_price) {
            newStock.sellInStock -= cartItem.quantity;
          } else if (cartItem.rent_price) {
            newStock.rentInStock -= cartItem.days;
          }

          if (newStock.sellInStock >= 0 && newStock.rentInStock >= 0) {
            await updateDoc(productRef, newStock);
          } else {
            toast.error(
              `Out of stock for ${productData.name}. Available stock was ${
                newStock.sellInStock + cartItem.quantity
              } before it went out of stock.`
            );
            return;
          }
        } else if (matchingProducts.length === 0) {
          toast.error(`Product not found for ${cartItem.name}`);
          return;
        } else {
          toast.error(`Ambiguous product match for ${cartItem.name}`);
          return;
        }
      }

      await addDoc(primaryOrdersCollection, orderToSave);

      const cartRef = doc(db, "cart", user.uid);
      await setDoc(cartRef, { cart: [] });

      toast.success("Order has been made");
      navigate("/");
    }
  };

  const handleCardPayment = async () => {
    if (paymentMethod === "Card" && stripe && elements) {
      try {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          toast.error("Card input is missing or invalid.");
          return;
        }

        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
          console.error("Stripe Error:", error);
          toast.error(
            "Unable to process the payment. Please check your card details."
          );
        } else {
          const response = await fetch("/api/process-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: token.id,
              amount: (sellTotal + rentTotal) * 100,
            }),
          });

          if (response.ok) {
            const primaryOrdersCollection = collection(db, "orders");
            const totalAmount = sellTotal + rentTotal;
            const orderToSave = {
              ...order[0],
              timestamp: serverTimestamp(),
              userUID: user.uid,
              totalAmount,
            };

            for (const cartItem of cart) {
              const productQuery = query(
                collection(db, "products"),
                where("name", "==", cartItem.name),
                where("category", "==", cartItem.category)
              );

              const productQuerySnapshot = await getDocs(productQuery);
              const matchingProducts = [];

              productQuerySnapshot.forEach((doc) => {
                matchingProducts.push(doc);
              });

              if (matchingProducts.length === 1) {
                const productRef = matchingProducts[0].ref;
                const productData = matchingProducts[0].data();
                const newStock = { ...productData };

                if (cartItem.sell_price) {
                  newStock.sellInStock -= cartItem.quantity;
                } else if (cartItem.rent_price) {
                  newStock.rentInStock -= cartItem.days;
                }

                if (newStock.sellInStock >= 0 && newStock.rentInStock >= 0) {
                  await updateDoc(productRef, newStock);
                } else {
                  toast.error(
                    `Out of stock for ${
                      productData.name
                    }. Available stock was ${
                      newStock.sellInStock + cartItem.quantity
                    } before it went out of stock.`
                  );
                  return;
                }
              } else if (matchingProducts.length === 0) {
                toast.error(`Product not found for ${cartItem.name}`);
                return;
              } else {
                toast.error(`Ambiguous product match for ${cartItem.name}`);
                return;
              }
            }

            await addDoc(primaryOrdersCollection, orderToSave);

            const cartRef = doc(db, "cart", user.uid);
            await setDoc(cartRef, { cart: [] });
            toast.success("Payment successful!");
            navigate("/");
          } else {
            console.error("Stripe API Error Response:");
            console.error("Status Code:", response.status);

            const responseText = await response.text();
            console.error("Response Body:", responseText);

            toast.error("An error occurred while processing your payment.");
          }
        }
      } catch (error) {
        console.error("Stripe Error:", error);
        toast.error("Unable to initiate the payment. Please try again later.");
      }
    }
  };

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
    <>
      <div className="bg-checkout w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[560px] text-7xl font-extrabold tracking-wider text-white">
          Checkout
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto py-[60px] flex">
        <div className="w-2/3 pr-10">
          <div className="w-full">
            {user && order.length > 0 ? (
              order.map((item, index) => (
                <ul key={index} className="mb-8">
                  <h2 className="font-extrabold mb-[40px] text-2xl">
                    Order Information
                  </h2>
                  <div className="mt-4 mb-[40px]">
                    <h3 className="font-semibold mb-2">
                      Shipping Information:
                    </h3>
                    <p>First Name: {item.firstName}</p>
                    <p>Last Name: {item.lastName}</p>
                    <p>Phone Number: {item.phoneNumber}</p>
                    <p>City: {item.city}</p>
                    <p>County: {item.county}</p>
                    <p>Country: {item.country}</p>
                  </div>
                  <div className="mt-4 mb-[40px]">
                    <h3 className="font-semibold mb-2">Payment Method:</h3>
                    <p>{item.paymentMethod}</p>
                  </div>
                  <div className="mt-4 mb-[60px]">
                    <h3 className="font-semibold mb-2">Ordered Items:</h3>
                    <div className="mt-[20px] mb-[50px]">
                      <span className="mx-[30px] font-extrabold">Image</span>
                      <span className="ml-[160px] font-extrabold">Name</span>
                      <span className="ml-[200px] font-extrabold">
                        Quantity/Days
                      </span>
                      <span className="ml-[135px] font-extrabold">Price</span>
                    </div>
                    {cart && cart.length > 0 ? (
                      cart.map((cartItem, cartIndex) => (
                        <div
                          key={cartIndex}
                          className="flex items-center justify-between gap-6 mt-6"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className="w-32 h-32 object-contain"
                              src={cartItem.image}
                              alt="productImg"
                            />
                          </div>
                          <h2 className="w-52">{cartItem.name}</h2>

                          {cartItem.sell_price ? (
                            <>
                              <p className="w-24">
                                Quantity: {cartItem.quantity}
                              </p>
                              <p className="w-10">${cartItem.sell_price}</p>
                            </>
                          ) : (
                            <>
                              {cartItem.rent_price && (
                                <>
                                  <p className="w-24">Days: {cartItem.days}</p>
                                  <p className="w-10">${cartItem.rent_price}</p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No items in cart.</p>
                    )}
                  </div>
                </ul>
              ))
            ) : (
              <p>No order information available.</p>
            )}
          </div>
          <Link to="/shipping">
            <button className="bg-red-500 text-white py-2 px-6 hover:bg-red-800 duration-300 mr-[20px]">
              Back to Shipping
            </button>
          </Link>
        </div>
        <div className="w-1/3 bg-[#fafafa] py-6 px-4">
          <div className="flex flex-col gap-6 broder-b-[1px] border-b-gray-400 pb-6">
            <h2 className="text-2xl font-medium">Order Total</h2>
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
          {paymentMethod === "Cash" ? (
            <button
              onClick={handleCashPayment}
              className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleCardPayment}
              className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300"
            >
              <PaymentForm />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

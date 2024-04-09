import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import { toast } from "react-toastify";

const ShippingPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setCurrentUser(user);
    if (user) {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !city ||
      !county ||
      !country
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const orderRef = doc(db, "shipping", currentUser.uid);

      let updatedOrder = [];

      updatedOrder.push({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        county: county,
        country: country,
        paymentMethod: paymentMethod,
        cart: cart,
      });

      await setDoc(orderRef, { order: updatedOrder });

      navigate("/checkout");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while processing your order. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-ship w-full h-[300px] object-cover">
        <div className="pt-[120px] pl-[560px] text-7xl font-extrabold tracking-wider text-white">
          Shipping
        </div>
      </div>
      <div className="w-2/3 pr-10 ml-[50px] mt-[50px]">
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block font-semibold mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block font-semibold mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="county" className="block font-semibold mb-1">
                County
              </label>
              <input
                type="text"
                id="county"
                name="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="block font-semibold mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-semibold mb-1 mt-[50px]">
                Payment Method
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={() => setPaymentMethod("Card")}
                  className="mr-2"
                />
                Pay with Card
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  value="Cash"
                  checked={paymentMethod === "Cash"}
                  onChange={() => setPaymentMethod("Cash")}
                  className="mr-2"
                />
                Pay with Cash
              </label>
            </div>
            <div className="my-[60px]">
              <Link to="/cart">
                <button className="bg-red-500 text-white py-2 px-6 hover:bg-red-800 duration-300 mr-[20px]">
                  Back to Cart
                </button>
              </Link>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-6 hover:bg-green-800 duration-300"
              >
                Continue to Checkout
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShippingPage;

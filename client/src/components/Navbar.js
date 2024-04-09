import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import {
  AiOutlineShoppingCart,
  AiTwotoneHeart,
  AiOutlineMenu,
} from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { FaNewspaper } from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [stickyClass, setStickyClass] = useState("relative");
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    if (option === "Option 1") {
      navigate("/admindashboard");
    } else {
      if (option === "Option 2") {
        navigate("/settings");
      } else {
        if (option === "Option 3") {
          handleLogout();
        } else navigate("/orders");
      }
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        setCurrentUser({
          uid: user.uid,
          displayName: userSnapshot.data()?.username,
          imageUrl: userSnapshot.data()?.imageUrl,
          role: userSnapshot.data()?.role,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/");
      toast.success("Successful Logout");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 500
        ? setStickyClass("fixed w-full shadow-md z-50")
        : setStickyClass("relative");
    }
  };

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

  const totalCartQuantity = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const wishlistRef = doc(db, "wishlist", user.uid);
        onSnapshot(wishlistRef, (snapshot) => {
          const wishlistData = snapshot.data();
          if (wishlistData) {
            setWishlistItemCount(wishlistData.wishlist.length);
          } else {
            setWishlistItemCount(0);
          }
        });
      } else {
        setWishlistItemCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={
        sidebarIsOpen
          ? `flex h-14 px-5 py-2.5 items-center justify-between border-b-2 border-black bg-white ${stickyClass} mb-[50px]`
          : `flex h-14 px-5 py-2.5 items-center justify-between border-b-2 border-black bg-white ${stickyClass}`
      }
    >
      <button
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        className="left-4 items-center"
      >
        <AiOutlineMenu size={30} />
      </button>
      <div className="font-roboto text-5xl flex-none flex pl-8 mr-32">
        <Link to="/">GameHunt</Link>
      </div>
      <div className="flex-1 w-64 flex justify-end">
        <div className="mx-6 flex font-roboto items-center underline-offset-2 hover:underline cursor-pointer">
          <span className="mr-2">
            <FiSearch />
          </span>
          <Link to="/searchscreen">Search</Link>
        </div>
        <div className="mx-6 flex font-roboto items-center cursor-pointer">
          <span className="mr-2">
            <FaNewspaper />
          </span>
          <Link to="/terms" className="underline-offset-2 hover:underline">
            Terms
          </Link>
        </div>
        <div className="mx-5 flex font-roboto items-center cursor-pointer">
          <span className="mr-2">
            <AiTwotoneHeart />
          </span>
          <Link to="/wishlist" className="underline-offset-2 hover:underline">
            Wishlist
          </Link>
          <div className="rounded-full p-1 bg-red-500 ml-1 text-white">
            {wishlistItemCount}
          </div>
        </div>
        <div className="mx-6 flex font-roboto items-center underline-offset-2 hover:underline cursor-pointer">
          {currentUser && currentUser.displayName ? (
            <>
              {currentUser.imageUrl && (
                <img
                  src={currentUser.imageUrl}
                  alt="User"
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                />
              )}
              <button onClick={toggleDropdown} className="ml-3 mr-5">
                {currentUser.displayName}
              </button>
              {isDropdownOpen && (
                <ul className="absolute top-8 right-[150px] mt-[20px] w-40 bg-white rounded-md shadow-lg z-10">
                  {currentUser.role === "Admin" ? (
                    <>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 1")}
                      >
                        Admin Dashboard
                      </li>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 4")}
                      >
                        Orders
                      </li>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 2")}
                      >
                        Settings
                      </li>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 3")}
                      >
                        Logout
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 4")}
                      >
                        Orders
                      </li>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 2")}
                      >
                        Settings
                      </li>
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOptionClick("Option 3")}
                      >
                        Logout
                      </li>
                    </>
                  )}
                </ul>
              )}
            </>
          ) : (
            <>
              <span className="mr-2">
                <VscAccount />
              </span>
              <Link to="/signin">My Account</Link>
            </>
          )}
        </div>
        <div className="mx-6 flex font-roboto items-center cursor-pointer">
          <span className="mr-2">
            <AiOutlineShoppingCart />
          </span>
          <Link to="/cart" className="underline-offset-2 hover:underline">
            Cart
          </Link>
          <div className="rounded-full p-1 bg-red-500 ml-1 text-white">
            {totalCartQuantity}
          </div>
        </div>
      </div>
      <ul
        className={
          sidebarIsOpen ? `absolute top-[70px] left-[300px]` : `hidden`
        }
      >
        <li className="inline mr-[150px] border-solid rounded-md border-[10px] bg-black border-black text-white">
          <Link to={"/games"}>
            <button>Games</button>
          </Link>
        </li>
        <li className="inline mr-[150px] border-solid rounded-md border-[10px] bg-black border-black text-white">
          <Link to={"/consoles"}>
            <button>Consoles</button>
          </Link>
        </li>
        <li className="inline mr-[150px] border-solid rounded-md border-[10px] bg-black border-black text-white">
          <Link to={"/accessories"}>
            <button>Accessories</button>
          </Link>
        </li>
        <li className="inline mr-[150px] border-solid rounded-md border-[10px] bg-black border-black text-white">
          <Link to={"/sell"}>
            <button>Sell</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

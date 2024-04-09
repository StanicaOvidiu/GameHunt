import React, { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { auth, storage, db } from "../firebase.config";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [image, setImage] = useState(null);
  const [phonenumber, setPhonenumber] = useState("");

  const navigate = useNavigate();

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(phonenumber)) {
      toast.error("Phone Number must contain only digits.");
      return;
    }

    const phoneNumberQuery = query(
      collection(db, "users"),
      where("phonenumber", "==", phonenumber)
    );
    const phoneNumberQuerySnapshot = await getDocs(phoneNumberQuery);

    if (!phoneNumberQuerySnapshot.empty) {
      toast.error("Phone number is already in use");
      return;
    }

    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const emailQuerySnapshot = await getDocs(emailQuery);

    if (!emailQuerySnapshot.empty) {
      toast.error("Email address is already in use");
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return;
    }

    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
      toast.error(
        "Password must contain at least one capital letter, one special character, and one number"
      );
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let downloadURL = null;

      if (image) {
        const storageRef = ref(storage, `user_images/${user.uid}`);
        await uploadBytes(storageRef, image);
        downloadURL = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        firstname,
        lastname,
        username,
        email,
        imageUrl: downloadURL,
        password,
        phonenumber,
        role: "User",
      });

      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <div className="bg-atomic h-full w-full bg-contain flex items-center justify-center">
        <div className="w-[30%] p-[20px] bg-white">
          <form onSubmit={handleSignUp}>
            <div className="text-3xl mb-[10px] font-roboto flex justify-center">
              REGISTER
            </div>
            <div className="mb-[20px]">
              <div>First Name</div>
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                className="border-4 flex-1 min-w-[60%] my-[10px] p-[10px] mx-[10px]"
                type="text"
                required
              />
            </div>
            <div className="mb-[20px]">
              <div>Last Name</div>
              <input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
                className="border-4 flex-1 min-w-[60%] my-[10px] p-[10px] mx-[10px]"
                type="text"
                required
              />
            </div>
            <div className="mb-[20px]">
              <div>Phone Number</div>
              <input
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
                placeholder="Phone Number"
                className="border-4 flex-1 min-w-[60%] my-[10px] p-[10px] mx-[10px]"
                type="tel"
                required
              />
            </div>
            <div className="mb-[20px]">
              <div>Username</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border-4 flex-1 min-w-[60%] my-[10px] p-[10px] mx-[10px]"
                type="text"
                required
              />
            </div>
            <div className="mb-[20px]">
              <div>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border-4 flex-1 min-w-[60%] my-[10px] p-[10px] mx-[10px]"
                type="email"
                required
              />
            </div>
            <div>Password</div>
            <div className="flex mb-[20px]">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-4 flex-1 min-w-[40%] my-[10px] p-[10px] mx-[10px]"
                type={passwordType}
                required
              />
              <span className="mt-[25px]" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </span>
            </div>
            <div>Confirm Password</div>
            <div className="flex mb-[20px]">
              <input
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                placeholder="Confirm Password"
                className="border-4 flex-1 min-w-[10%] my-[10px] p-[10px] mx-[10px]"
                type={passwordType}
                required
              />
              <span className="mt-[25px]" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </span>
            </div>
            <div className="mb-[20px]">
              <div>Image</div>
              <input
                className="ml-[30px] my-[20px]"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex">
              <div className="flex-1 text-base mx-0 my-[20px]">
                By creating an account, I consent to the processing of my
                personal data in accordance with the{" "}
                <b>
                  <Link to="/privacypolicy">PRIVACY POLICY</Link>
                </b>
              </div>
              <div className="flex-1 text-base ml-[80px] mt-[40px]">
                Already have an account ?{" "}
                <Link to="/signin" className="font-bold">
                  Login
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-[40%] border-collapse px-[20px] py-[15px] bg-teal-500 text-white cursor-pointer mb-[10px] mt-[20px] ml-[120px]"
            >
              CREATE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;

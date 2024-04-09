import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase.config";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [image, setImage] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [isEditingAddImage, setIsEditingAddImage] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [isEditingPhonenumber, setIsEditingPhonenumber] = useState(false);
  const [phonenumber, setPhonenumber] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username);
          setFirstName(userData.firstname || "");
          setLastName(userData.lastname || "");
          setPhonenumber(userData.phonenumber);
        }

        const imageRef = ref(storage, `user_images/${user.uid}`);
        try {
          const imageUrl = await getDownloadURL(imageRef);
          setImage(imageUrl);
        } catch (error) {
          setImage(null);
        }
      } else {
        setUser(null);
        setUsername("");
        setImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleEditNameClick = () => {
    setNewFirstName(firstName);
    setNewLastName(lastName);
    setIsEditingName(true);
  };

  const handleSaveNameClick = async () => {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      firstname: newFirstName,
      lastname: newLastName,
    });
    setFirstName(newFirstName);
    setLastName(newLastName);
    setIsEditingName(false);
  };

  const handleCancelNameClick = () => {
    setIsEditingName(false);
    setNewFirstName(firstName);
    setNewLastName(lastName);
  };

  const handleEditUsernameClick = () => {
    setNewUsername(username);
    setIsEditingUsername(true);
  };

  const handleSaveUsernameClick = async () => {
    if (newUsername.trim() !== "") {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { username: newUsername });
      setUsername(newUsername);
      setIsEditingUsername(false);
      window.location.reload();
    }
  };

  const handleCancelUsernameClick = () => {
    setIsEditingUsername(false);
    setNewUsername(username);
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password should be at least 8 characters long.");
      return;
    }

    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      toast.error(
        "New password must contain at least one capital letter, one special character, and one number"
      );
      return;
    }

    try {
      const credentials = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credentials);

      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        password: newPassword,
      });
    } catch (error) {
      toast.error("Current password is incorrect.");
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordChange(false);
  };

  const handleEditImageClick = () => {
    setNewImage(null);
    setIsEditingImage(true);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewImage(selectedImage);
  };

  const handleSaveImageClick = async () => {
    if (newImage) {
      const imageRef = ref(storage, `user_images/${user.uid}`);
      await uploadBytes(imageRef, newImage);

      const imageUrl = await getDownloadURL(imageRef);
      setImage(imageUrl);
      setIsEditingImage(false);

      await updateProfile(auth.currentUser, {
        photoURL: imageUrl,
      });
      window.location.reload();
    }
  };

  const handleCancelImageClick = () => {
    setIsEditingImage(false);
    setNewImage(null);
  };

  const handleEditAddImageClick = () => {
    setAddImage(null);
    setIsEditingAddImage(true);
  };

  const handleAddImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setAddImage(selectedImage);
  };

  const handleSaveAddImageClick = async () => {
    if (addImage) {
      const imageRef = ref(storage, `user_images/${user.uid}`);
      await uploadBytes(imageRef, addImage);

      const imageUrl = await getDownloadURL(imageRef);
      setAddImage(imageUrl);
      setIsEditingAddImage(false);

      await updateProfile(auth.currentUser, {
        imageURL: imageUrl,
      });

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        imageUrl: imageUrl,
      });

      window.location.reload();
    }
  };

  const handleCancelAddImageClick = () => {
    setIsEditingAddImage(false);
    setAddImage(null);
  };

  const handleEditPhonenumberClick = () => {
    setNewPhonenumber(phonenumber);
    setIsEditingPhonenumber(true);
  };

  const handleSavePhonenumberClick = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(newPhonenumber)) {
      toast.error("Invalid phone number format");
      return;
    }

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.phonenumber !== newPhonenumber) {
            const querySnapshot = await getDocs(
              query(
                collection(db, "users"),
                where("phonenumber", "==", newPhonenumber)
              )
            );

            if (querySnapshot.size === 0) {
              await updateDoc(userDocRef, { phonenumber: newPhonenumber });
              setPhonenumber(newPhonenumber);
              setIsEditingPhonenumber(false);
            } else {
              toast.error("Phone number is already in use.");
            }
          }
        }
      } catch (error) {
        console.error("Error updating phone number:", error);
      }
    }
  };

  const handleCancelPhonenumberClick = () => {
    setIsEditingPhonenumber(false);
    setNewPhonenumber(phonenumber);
  };

  return (
    <div className="bg-office h-full w-full bg-contain flex items-center justify-center">
      <div className="bg-white p-6 shadow-md rounded-md max-w-md w-full">
        <h2 className="text-4xl font-bold mb-[20px]">Profile</h2>
        {user ? (
          <div>
            <p className="text-lg font-semibold mb-[20px]">
              Email: {user.email}
            </p>
            <span className="text-lg font-semibold">Username: {username}</span>
            {isEditingUsername ? (
              <div>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border rounded p-1 w-full"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveUsernameClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelUsernameClick}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-[70px] mb-[20px]"
                onClick={handleEditUsernameClick}
              >
                Edit
              </button>
            )}
            <div className="my-[20px]">
              <span className="text-lg font-semibold">
                Phone number: {phonenumber}
              </span>
              {isEditingPhonenumber ? (
                <div>
                  <input
                    type="tel"
                    value={newPhonenumber}
                    onChange={(e) => setNewPhonenumber(e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSavePhonenumberClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelPhonenumberClick}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-[70px] mb-[20px]"
                  onClick={handleEditPhonenumberClick}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="mb-[20px]">
              <span className="text-lg font-semibold mb-2">
                Name: {firstName} {lastName}
              </span>
              {isEditingName ? (
                <div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNameClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelNameClick}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-[70px] mb-[20px]"
                  onClick={handleEditNameClick}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="mb-[40px]">
              <p className="text-lg font-semibold mb-2">Change Password:</p>
              {showPasswordChange ? (
                <div>
                  <div className="mt-[10px] flex">
                    <input
                      type={passwordType}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                    <span
                      className="ml-[10px] mt-[10px]"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </span>
                  </div>
                  <div className="mt-[10px] flex">
                    <input
                      type={passwordType}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                    <span
                      className="ml-[10px] mt-[10px]"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </span>
                  </div>
                  <div className="mt-[10px] flex">
                    <input
                      type={passwordType}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                    <span
                      className="ml-[10px] mt-[10px]"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-end my-[15px]">
                    <button
                      onClick={handlePasswordChange}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-[10px]"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={handleCancelPasswordChange}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => setShowPasswordChange(true)}
                >
                  Click here to change password
                </p>
              )}
            </div>
            {image ? (
              <div className="mb-4">
                <div>
                  <img
                    src={image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-2"
                  />
                  <br />
                  {isEditingImage ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleSaveImageClick}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        >
                          Save Image
                        </button>
                        <button
                          onClick={handleCancelImageClick}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditImageClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded  ml-[130px]"
                    >
                      Change Image
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p>No profile image available.</p>
                {isEditingAddImage ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImageChange}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSaveAddImageClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                      >
                        Save Image
                      </button>
                      <button
                        onClick={handleCancelAddImageClick}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleEditAddImageClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-[130px]"
                  >
                    Add Image
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

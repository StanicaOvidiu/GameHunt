import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import emailjs from "emailjs-com";

const CountdownTimer = ({ days, itemId, userUID, userEmail }) => {
  const initialTimeRemaining =
    localStorage.getItem(`timer_${itemId}`) || days * 24 * 60 * 60;
  const [timeRemaining, setTimeRemaining] = useState(
    parseInt(initialTimeRemaining)
  );
  const [isCountingUp, setIsCountingUp] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0 && !isCountingUp) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            localStorage.removeItem(`timer_${itemId}`);
            setIsCountingUp(true);
            const userDocRef = doc(db, "users", userUID);
            const updatedFields = { expired: true };

            updateDoc(userDocRef, updatedFields)
              .then(() => {
                console.log("User document updated with 'expired' field.");
                sendEmailNotification(userEmail);
              })
              .catch((error) => {
                console.error("Error updating user document:", error);
              });
            return 0;
          }
          localStorage.setItem(`timer_${itemId}`, prevTime - 1);
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (isCountingUp) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining, isCountingUp, itemId, userUID, userEmail]);

  const formatTime = (time) => {
    const pad = (num) => (num < 10 ? "0" + num : num);
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;

    return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  const sendEmailNotification = (toEmail) => {
    const templateParams = {
      to_email: toEmail,
      subject: "Countdown Timer Expired",
      message: "Your countdown timer has expired.",
    };

    emailjs.send("SERVICE_ID", "TEMPLATE_ID", templateParams, "USER_ID").then(
      (response) => {
        console.log("Email sent successfully:", response);
      },
      (error) => {
        console.error("Email send error:", error);
      }
    );
  };

  const timerClass = isCountingUp ? "text-red-600" : "text-green-600";

  return (
    <span className={`inline-block ${timerClass}`}>
      {isCountingUp ? "Timer" : "Countdown"}: {formatTime(timeRemaining)}
    </span>
  );
};

export default CountdownTimer;

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.error("Stripe Error:", error);
        toast.error(
          "Unable to process the payment. Please check your card details."
        );
      } else {
        console.log("Token:", token);

        cardElement.clear();
      }
    } catch (error) {
      console.error("Stripe Error:", error);
      toast.error("Unable to initiate the payment. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="cardElement" className="block font-medium mb-2">
          Card Details:
        </label>
        <CardElement
          id="cardElement"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
              },
            },
          }}
          onChange={(event) => {
            setCardError(event.error ? event.error.message : null);
          }}
        />
        {cardError && <p className="text-red-500 mt-2">{cardError}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-700"
      >
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;

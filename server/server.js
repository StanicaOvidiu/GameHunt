import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("STRIPE SECRET KEY");

app.use(cors());
app.use(bodyParser.json());

app.post("/api/process-payment", async (req, res) => {
  try {
    const { tokenId, amount } = req.body;

    const returnUrl = "http://localhost:3000/";
    const preciseAmount = Math.round(amount);

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: tokenId,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: preciseAmount,
      currency: "usd",
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: returnUrl,
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

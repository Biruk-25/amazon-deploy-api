

const dotenv = require("dotenv");
               dotenv.config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);


const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});


app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total, 10);

  if (!total || total <= 0) {
    return res.status(400).json({ message: "Total must be greater than 0" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.clientSecret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({
      message: "Payment processing failed",
      error: error.message,
    });
  }
});


// const PORT = process.env.PORT || 5000;
app.listen(5000, (err) => {
  if(err) throw err;
  console.log("Amazon server running on port: 5000, http://localhost:5000");
});

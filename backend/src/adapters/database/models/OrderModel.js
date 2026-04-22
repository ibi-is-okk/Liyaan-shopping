const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name:     { type: String },
        quantity: { type: Number, required: true },
        size:     { type: String },
        price:    { type: Number, required: true },
      },
    ],
    billingDetails: {
      firstName:   String,
      lastName:    String,
      company:     String,
      country:     String,
      streetAddress: String,
      city:        String,
      state:       String,
      phone:       String,
      email:       String,
      notes:       String,
    },
    subtotal: { type: Number, required: true },
    total:    { type: Number, required: true },
    status:   { type: String, enum: ["pending","processing","shipped","delivered","cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

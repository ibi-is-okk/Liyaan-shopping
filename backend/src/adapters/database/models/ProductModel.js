const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    description:  { type: String },
    price:        { type: Number, required: true },
    category:     { type: String, required: true },
    sizes:        [{ type: String, enum: ["XS","S","M","L","XL","XXL"] }],
    images:       [{ type: String }],
    stock:        { type: Number, default: 0 },
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false },
    isTrending:   { type: Boolean, default: false },
    totalOrdered: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);

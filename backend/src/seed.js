require("dotenv").config();
require("dotenv").config({ path: "../.env" });
const mongoose  = require("mongoose");
const UserModel    = require("./adapters/database/models/UserModel");
const ProductModel = require("./adapters/database/models/ProductModel");
const FAQModel     = require("./adapters/database/models/FAQModel");

const PRODUCTS = [
  { name: "2 Piece Embroidered Suit", description: "Premium lawn fabric with hand embroidery.", price: 4500, category: "suits", sizes: ["XS","S","M","L","XL"], stock: 15, isNewArrival: true, isTrending: false, totalOrdered: 42,
    images: ["http://localhost:5173/suit1.jpg"] },
  { name: "3 Piece Embroidered Red", description: "Luxurious 3-piece suit in vibrant red.", price: 6800, category: "suits", sizes: ["S","M","L","XL","XXL"], stock: 8, isNewArrival: true, isTrending: true, totalOrdered: 78,
    images: ["http://localhost:5173/suit2.jpg"] },
  { name: "2 Piece Embroidered Blue", description: "Royal blue fabric with floral embroidery.", price: 5200, category: "suits", sizes: ["XS","S","M","L"], stock: 12, isNewArrival: true, isTrending: true, totalOrdered: 65,
    images: ["http://localhost:5173/suit3.jpg"] },
  { name: "Winter 2 Piece Suit", description: "Khaddar 2 piece for winters", price: 3200, category: "suits", sizes: ["S","M","L","XL","XXL"], stock: 20, isNewArrival: false, isTrending: true, totalOrdered: 55,
    images: ["http://localhost:5173/suit4.jpg"] },
  { name: "Gold Hoop Earrings", description: "18k gold plated hoop earrings.", price: 1800, category: "jewelry", sizes: [], stock: 30, isNewArrival: false, isTrending: true, totalOrdered: 90,
    images: ["http://localhost:5173/j1.jpg"] },
  { name: "Pearl Necklace Set", description: "Faux pearl necklace with earrings.", price: 2400, category: "jewelry", sizes: [], stock: 18, isNewArrival: true, isTrending: false, totalOrdered: 33,
    images: ["http://localhost:5173/j2.jpg"] },
  { name: "Pink Diamond Pendant", description: "Crystal pendant with rose gold chain.", price: 3100, category: "jewelry", sizes: [], stock: 10, isNewArrival: true, isTrending: false, totalOrdered: 28,
    images: ["http://localhost:5173/j3.jpg"] },
  { name: "Floral Printed 3 Piece", description: "Floral print cotton with contrast dupatta.", price: 5500, category: "3-piece", sizes: ["XS","S","M","L","XL"], stock: 14, isNewArrival: false, isTrending: false, totalOrdered: 21,
    images: ["http://localhost:5173/suit5.jpg"] },
  { name: "Embroidered Kameez", description: "Loose fit embroidered cotton kameez.", price: 2900, category: "2-piece", sizes: ["L","XL","XXL"], stock: 7, isNewArrival: false, isTrending: false, totalOrdered: 19,
    images: ["http://localhost:5173/suit6.jpg"] },
];

const FAQS = [
  { question: "What is your shipping policy?", answer: "We offer standard shipping (3-5 days) and express shipping (1-2 days) across Pakistan.", category: "Shipping" },
  { question: "How can I return an item?", answer: "You can return items within 30 days of purchase if they are in original condition. Contact support for a return label.", category: "Returns" },
  { question: "Do you offer international shipping?", answer: "Currently, we only ship within Pakistan. We plan to expand to international shipping soon!", category: "Shipping" },
  { question: "What payment methods do you accept?", answer: "We accept Cash on Delivery, Credit/Debit Cards, and JazzCash/EasyPaisa.", category: "Payment" },
  { question: "How do I track my order?", answer: "Once your order is shipped, you will receive a tracking number via SMS and email.", category: "Orders" }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Create admin user
  const existing = await UserModel.findOne({ email: "admin@liyaan.com" });
if (!existing) {
  await UserModel.create({
    fullName: "Admin",
    email: "admin@liyaan.com",
    password: "admin123",  // plain text — model will hash it automatically
    isAdmin: true,
  });
  console.log("Admin user created: admin@liyaan.com / admin123");
}
  // Seed products
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products`);

  // Seed FAQs
  await FAQModel.deleteMany({});
  await FAQModel.insertMany(FAQS);
  console.log(`Seeded ${FAQS.length} FAQs`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => { console.error(err); process.exit(1); });

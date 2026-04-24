require("dotenv").config();
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const UserModel    = require("./src/adapters/database/models/UserModel");
const ProductModel = require("./src/adapters/database/models/ProductModel");

const PRODUCTS = [
  { name: "2 Piece Embroidered Suit",  description: "Premium lawn fabric with hand embroidery.", price: 4500, category: "suits",   sizes: ["XS","S","M","L","XL"], stock: 15, isNewArrival: true,  isTrending: false, totalOrdered: 42 },
  { name: "3 Piece Embroidered Red",   description: "Luxurious 3-piece suit in vibrant red.",    price: 6800, category: "suits",   sizes: ["S","M","L","XL","XXL"], stock: 8, isNewArrival: true,  isTrending: true,  totalOrdered: 78 },
  { name: "2 Piece Embroidered Blue",  description: "Royal blue fabric with floral embroidery.", price: 5200, category: "suits",   sizes: ["XS","S","M","L"], stock: 12, isNewArrival: true,  isTrending: true,  totalOrdered: 65 },
  { name: "Winter Wool Hoodie",        description: "Warm wool blend hoodie for winter.",        price: 3200, category: "winter",  sizes: ["S","M","L","XL","XXL"], stock: 20, isNewArrival: false, isTrending: true,  totalOrdered: 55 },
  { name: "Gold Hoop Earrings",        description: "18k gold plated hoop earrings.",            price: 1800, category: "jewelry", sizes: [], stock: 30, isNewArrival: false, isTrending: true,  totalOrdered: 90 },
  { name: "Pearl Necklace Set",        description: "Faux pearl necklace with earrings.",        price: 2400, category: "jewelry", sizes: [], stock: 18, isNewArrival: true,  isTrending: false, totalOrdered: 33 },
  { name: "Pink Diamond Pendant",      description: "Crystal pendant with rose gold chain.",     price: 3100, category: "jewelry", sizes: [], stock: 10, isNewArrival: true,  isTrending: false, totalOrdered: 28 },
  { name: "Floral Printed 3 Piece",    description: "Floral print cotton with contrast dupatta.",price: 5500, category: "3-piece", sizes: ["XS","S","M","L","XL"], stock: 14, isNewArrival: false, isTrending: false, totalOrdered: 21 },
  { name: "Embroidered Kameez",        description: "Loose fit embroidered cotton kameez.",      price: 2900, category: "2-piece", sizes: ["L","XL","XXL"], stock: 7, isNewArrival: false, isTrending: false, totalOrdered: 19 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Create admin user
  const existing = await UserModel.findOne({ email: "admin@liyaan.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await UserModel.create({
      fullName: "Admin",
      email: "admin@liyaan.com",
      password: hashed,
      isAdmin: true,
    });
    console.log("Admin user created: admin@liyaan.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Seed products
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => { console.error(err); process.exit(1); });

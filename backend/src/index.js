require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const connectDB    = require("./config/db");
const errorHandler = require("./adapters/http/middleware/errorHandler");

const MongoUserRepository    = require("./adapters/database/repositories/MongoUserRepository");
const MongoProductRepository = require("./adapters/database/repositories/MongoProductRepository");
const MongoOrderRepository   = require("./adapters/database/repositories/MongoOrderRepository");
const MongoReviewRepository  = require("./adapters/database/repositories/MongoReviewRepository");

const AuthUseCases         = require("./application/usecases/AuthUseCases");
const ProductUseCases      = require("./application/usecases/ProductUseCases");
const OrderUseCases        = require("./application/usecases/OrderUseCases");
const WishlistCartUseCases = require("./application/usecases/WishlistCartUseCases");
const ReviewUseCases       = require("./application/usecases/ReviewUseCases");
const AdminUseCases        = require("./application/usecases/AdminUseCases");

const AuthController         = require("./adapters/http/controllers/AuthController");
const ProductController      = require("./adapters/http/controllers/ProductController");
const OrderController        = require("./adapters/http/controllers/OrderController");
const WishlistCartController = require("./adapters/http/controllers/WishlistCartController");
const ReviewController       = require("./adapters/http/controllers/ReviewController");
const AdminController        = require("./adapters/http/controllers/AdminController");

const authRoutes    = require("./adapters/http/routes/authRoutes");
const productRoutes = require("./adapters/http/routes/productRoutes");
const orderRoutes   = require("./adapters/http/routes/orderRoutes");
const userRoutes    = require("./adapters/http/routes/userRoutes");
const reviewRoutes  = require("./adapters/http/routes/reviewRoutes");
const adminRoutes   = require("./adapters/http/routes/adminRoutes");

// Dependency injection
const userRepo    = new MongoUserRepository();
const productRepo = new MongoProductRepository();
const orderRepo   = new MongoOrderRepository();
const reviewRepo  = new MongoReviewRepository();

const authUseCases         = new AuthUseCases(userRepo);
const productUseCases      = new ProductUseCases(productRepo);
const orderUseCases        = new OrderUseCases(orderRepo, productRepo, userRepo);
const wishlistCartUseCases = new WishlistCartUseCases(userRepo);
const reviewUseCases       = new ReviewUseCases(reviewRepo);
const adminUseCases        = new AdminUseCases(userRepo, productRepo, orderRepo);
adminUseCases.productRepo  = productRepo; // expose for getAllProducts in controller

const authController         = new AuthController(authUseCases);
const productController      = new ProductController(productUseCases);
const orderController        = new OrderController(orderUseCases);
const wishlistCartController = new WishlistCartController(wishlistCartUseCases);
const reviewController       = new ReviewController(reviewUseCases);
const adminController        = new AdminController(adminUseCases);

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth",     authRoutes(authController));
app.use("/api/products", productRoutes(productController));
app.use("/api/orders",   orderRoutes(orderController));
app.use("/api/user",     userRoutes(wishlistCartController));
app.use("/api/reviews",  reviewRoutes(reviewController));
app.use("/api/admin",    adminRoutes(adminController));

app.use(errorHandler);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server on port ${process.env.PORT || 5000}`)
  );
});

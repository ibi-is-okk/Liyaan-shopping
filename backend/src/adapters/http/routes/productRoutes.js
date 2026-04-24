const express = require("express");

module.exports = (productController) => {
  const router = express.Router();
  router.get("/",            productController.getAll);
  router.get("/trending",    productController.getTrending);
  router.get("/new-arrivals",productController.getNewArrivals);
  router.get("/search",      productController.search);
  router.get("/:id",         productController.getById);
  router.post("/",           productController.create);
  return router;
};

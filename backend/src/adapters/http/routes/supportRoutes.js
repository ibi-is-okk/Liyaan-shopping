const express = require("express");

const supportRoutes = (controller) => {
  const router = express.Router();

  router.get("/faqs", (req, res, next) => controller.getFAQs(req, res, next));
  router.post("/chat", (req, res, next) => controller.chat(req, res, next));

  return router;
};

module.exports = supportRoutes;

const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

router.post("/", isAuthenticated, productController.createProduct);
router.post("/buy", isAuthenticated, productController.createOrder);
router.get("/", isAuthenticated, productController.getProducts);
// Dùng cú pháp chuẩn /:productId
router.get("/:productId", isAuthenticated, productController.getProductsById);
// router.get("/productId", isAuthenticated, productController.getProductsById);
module.exports = router;

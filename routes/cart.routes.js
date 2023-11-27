var express = require("express");
var router = express.Router();
const {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cart.controller.js");

router.get("/:cartId", getCartByUserId);
router.post("/:cartId", addToCart);
router.put("/:cartId", updateCartItem);
router.delete("/:cartId", removeFromCart);

module.exports = router;

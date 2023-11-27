var express = require("express");
var router = express.Router();
const authUser = require("../middlewares/authUser");

const {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  registerManager,
  loginManager,
  logoutManager,
  updateCustomer,
} = require("../controllers/users.controller");

/* GET users listing. */
router.post("/customers/register", registerCustomer);
router.post("/customers/login", loginCustomer);
router.post("/customers/logout", authUser, logoutCustomer);
router.post("/managers/register", registerManager);
router.post("/managers/login", loginManager);
router.post("/managers/logout", logoutManager);
// router.get("/customers/me", authUser, getUserInfo);
router.put("/customers/:id", authUser, updateCustomer)

module.exports = router;

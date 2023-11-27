var express = require("express");
var router = express.Router();
const {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} = require ("../controllers/products.controller");

//For Managers//
router.get('/managers', getAllProducts);
router.get('/managers/:productsId', getProductById);
router.post('/managers', createProduct);
router.put('/managers', updateProduct);
router.delete('/managers', deleteProduct);

//For Customers//
router.get('/customers/all', getAllProducts);
router.get('/customers/:productId', getProductById)

module.exports = router;
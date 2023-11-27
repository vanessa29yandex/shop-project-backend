const express = require('express');
const router = express.Router();
const {createCategory, getAllCategories, updateCategory, deleteCategory}  = require('../controllers/categories.controller');

router.get('/', getAllCategories);
router.post('/managers', createCategory);
router.put('/managers/:id', updateCategory);
router.delete('/managers/:id', deleteCategory);

module.exports = router;
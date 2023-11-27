const Category = require('../models/Category.model');

getAllCategories = async (req, res) => {
  // Implement logic to get all categories
};

createCategory = async (req, res) => {

  const name = req.body.category_name
  try{
  const category = await Category.create({category_name: name})
  
  if (!category) throw new Error("Unable to create category")

  return res.status(200).send({
    success: true,
    message: 'created category'
  });
} catch (error){
  return res.status(500).json({
    message: `error in add new category - for managers`,
    error: error.message,
  });
  }
}

updateCategory = async (req, res) => {
  // Implement logic to update a category by ID
};

deleteCategory = async (req, res) => {
  // Implement logic to delete a category by ID
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
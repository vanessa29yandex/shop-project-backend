const Product = require("../models/Products.model");
const objectName = "product";
const Category = require("../models/Category.model");
const mongoose = require("mongoose");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("categories.category");
    return res.status(200).json({
      success: true,
      message: `success to find all ${objectName}s`,
      products,
    });
  } catch (error) {
    return res.status(500).jason({
      message: `error in get all ${objectName}s`,
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const {productId} = req.params
  try {
    const product = await Product.findById(productId).populate(
      "categories.category"
    );
    return res.status(200).json({
      success: true,
      message: `success to find all ${objectName}`,
     product
    });
  } catch (error) {
    return res.status(500).jason({
      message: `error in get all ${objectName}`,
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  const {
    product_name,
    product_description,
    product_price,
    product_image,
    categories,
  } = req.body;

  try {
    const categoriesObjectsArray = await Promise.all(
      categories.map(async (categoryId) => {
        if (mongoose.Types.ObjectId.isValid(categoryId)) {
          return { category: categoryId };
        } else {
          const newCategory = await Category.findOneAndUpdate(
            {
              category_name: categoryId,
            },
            {
              category_name: categoryId,
            },
            { upsert: true }
          );
          return { category: newCategory._id };
        }
      })
    );

    const newProduct = await Product.create({
      product_name,
      product_description,
      product_price,
      product_image,
      categories: categoriesObjectsArray,
    });

    if (!newProduct) throw new Error("Could not create new Product");

    return res.status(200).send({
      message: "Created product successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: `error in get all ${objectName} - for managers`,
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updateData = req.body; // The data you want to update

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true, // This option returns the updated document
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `No ${objectName} found with the given ID`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully updated the ${objectName}`,
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating the ${objectName} - for managers`,
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `No ${objectName} found with the given ID`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted the ${objectName}`,
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting the ${objectName} - for managers`,
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

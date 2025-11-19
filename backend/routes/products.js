const express = require('express');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products (Admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product (Admin only)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, sku, price, stock } = req.body;

    // Validate required fields
    if (!name || !sku || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const product = new Product({
      name,
      sku: sku.toUpperCase(),
      price: parseFloat(price),
      stock: parseInt(stock)
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, sku, price, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU is being changed and if it already exists
    if (sku && sku.toUpperCase() !== product.sku) {
      const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
      product.sku = sku.toUpperCase();
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


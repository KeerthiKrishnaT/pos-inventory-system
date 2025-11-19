const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const { authenticate, isAdmin, isEmployee } = require('../middleware/auth');

const router = express.Router();

// Get all sales (Admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('soldBy', 'email')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single sale (Admin only)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('soldBy', 'email')
      .populate('items.product', 'name sku');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sale (Employee only)
router.post('/', authenticate, isEmployee, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate items and check stock
    const saleItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // Create sale record
    const sale = new Sale({
      items: saleItems,
      totalAmount: totalAmount,
      soldBy: user._id,
      soldByName: user.email
    });

    await sale.save();

    // Update stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate sale for response
    const populatedSale = await Sale.findById(sale._id)
      .populate('soldBy', 'email')
      .populate('items.product', 'name sku');

    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products for POS (Employee only - for search/select)
router.get('/pos/products', authenticate, isEmployee, async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } })
      .select('name sku price stock')
      .sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soldByName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);


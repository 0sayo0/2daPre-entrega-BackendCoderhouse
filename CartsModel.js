const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
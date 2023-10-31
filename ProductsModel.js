const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  // Agrega los demás campos que necesites
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
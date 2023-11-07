//-----------------------------------------------------------------------------------------
/** Jonathan Morales Comision: 55575 - 4to Entregable programacion Backend Coderhouse */
//-----------------------------------------------------------------------------------------

const express = require('express');
const { ProductManager, isProductIdValid } = require('../ProductManager.js');
const { CartManager, isCartIdValid } = require('./CartManager.js');

const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const db = require('../db.js');

const app = express();
// const port = process.env.PORT || 8080; // Puerto en el que se ejecutará el servidor
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

const productRouter = express.Router();
const cartRouter = express.Router();

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
// app.use('/carts', cartRouter);

db.connect();

// Ruta para obtener todos los productos (con límite opcional)
productRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener un producto por ID
productRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  if (isProductIdValid(productId)) {
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  } else {
    res.status(400).json({ error: 'ID de producto no válido' });
  }
});

// Ruta POST para agregar un nuevo producto
productRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;
    productManager.addProduct(productData);
    io.emit('product-updated');
    res.status(201).json({ message: 'Producto agregado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto.' });
  }
});

productRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  if (isProductIdValid(productId)) {
      try {
          const updatedProduct = req.body;
          if (updatedProduct.id) {
              delete updatedProduct.id;
          }
          productManager.updateProduct(productId, updatedProduct);
          res.json({ message: 'Producto actualizado exitosamente.' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al actualizar el producto.' });
      }
  } else {
      res.status(400).json({ error: 'ID de producto no válido.' });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  if (isProductIdValid(productId)) {
      try {
          productManager.deleteProduct(productId);
          io.emit('product-updated');
          res.json({ message: 'Producto eliminado exitosamente.' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al eliminar el producto.' });
      }
  } else {
      res.status(400).json({ error: 'ID de producto no válido.' });
  }
});

// Ruta para crear un nuevo carrito
cartRouter.post('/', (req, res) => {
  try {
      const newCart = cartManager.createCart();
      res.status(201).json(newCart);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});

// Ruta para añadir un producto a un carrito específico
cartRouter.post('/:cartId/products', (req, res) => {
  const cartId = parseInt(req.params.cartId);
  if (isCartIdValid(cartId)) {
      try {
          const product = req.body;
          cartManager.addProductToCart(cartId, product);
          res.status(201).json({ message: 'Producto añadido al carrito exitosamente.' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al añadir el producto al carrito.' });
      }
  } else {
      res.status(400).json({ error: 'ID de carrito no válido.' });
  }
});

// Ruta para obtener productos de un carrito específico
cartRouter.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  if (isCartIdValid(cartId)) {
      try {
          const cart = cartManager.getCartById(cartId);
          if (cart) {
              res.json(cart.products);
          } else {
              res.status(404).json({ error: 'Carrito no encontrado.' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener productos del carrito.' });
      }
  } else {
      res.status(400).json({ error: 'ID de carrito no válido.' });
  }
});

// Ruta para añadir un producto a un carrito específico usando su id
cartRouter.post('/:cartId/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.pid);
  if (isCartIdValid(cartId) && isProductIdValid(productId)) {
      try {
          cartManager.addProductToCart(cartId, productId);
          res.status(201).json({ message: 'Producto añadido al carrito exitosamente.' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al añadir el producto al carrito.' });
      }
  } else {
      res.status(400).json({ error: 'ID de carrito o producto no válido.' });
  }
});

// Nueva ruta para la vista home.handlebars
productRouter.get('/home', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado con socket.io', socket.id);

  socket.on('add-product', (productData) => {
      try {
          productManager.addProduct(productData);
          io.emit('product-updated');
      } catch (error) {
          console.error("Error adding product:", error);
          socket.emit('error', 'Error al agregar el producto');
      }
  });

  socket.on('delete-product', (productId) => {
      try {
          productManager.deleteProduct(productId);
          io.emit('product-updated');
      } catch (error) {
          console.error("Error deleting product:", error);
          socket.emit('error', 'Error al eliminar el producto');
      }
  });

  socket.on('disconnect', () => {
      console.log('Usuario desconectado', socket.id);
  });
});

productRouter.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});


// app.listen(port, () => {
//   console.log(`Servidor Express en ejecución en el puerto ${port}`);
// });
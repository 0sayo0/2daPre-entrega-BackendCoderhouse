//-----------------------------------------------------------------------------------------
/** Jonathan Morales Comision: 55575 - 3er Entregable programacion Backend Coderhouse */
//-----------------------------------------------------------------------------------------

const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor

const manager = new ProductManager('productos.json');

app.use(express.json());

// Ruta para obtener todos los productos (con límite opcional)
app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await manager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  if (!isNaN(productId)) {
    try {
      const product = await manager.getProductById(productId);
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

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
import express from 'express';
import ProductsManager from '../ProductsManager.js';

const router = express.Router();
const productsManager = new ProductsManager('products');

// Ruta raíz GET /api/products
router.get('/', (req, res) => {
  // Obtener el límite de productos de los parámetros de la solicitud
  const limit = req.query.limit;
  
  // Obtener todos los productos
  const products = productsManager.getProducts();
  
  // Comprobar si se proporcionó un límite
  if (limit) {
    // Limitar los productos según el límite especificado
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    // Devolver todos los productos
    res.json(products);
  }
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  // Obtener el ID del producto de los parámetros de la solicitud
  const productId = parseInt(req.params.pid);
  
  // Obtener el producto por su ID
  const product = productsManager.getProductById(productId);
  
  // Comprobar si el producto no se encontró
  if (typeof product === 'string') {
    res.status(404).json({ error: product });
  } else {
    // Devolver el producto encontrado
    res.json(product);
  }
});

// Ruta raíz POST /api/products
router.post('/', (req, res) => {
  // Obtener el nuevo producto del cuerpo de la solicitud
  const newProduct = req.body;
  
  // Agregar el nuevo producto
  const result = productsManager.addProduct(newProduct);
  
  // Comprobar si hubo un error al agregar el producto
  if (typeof result === 'string') {
    res.status(400).json({ error: result });
  } else {
    // Devolver el producto agregado exitosamente
    res.status(201).json(result);
  }
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  // Obtener el ID del producto de los parámetros de la solicitud
  const productId = parseInt(req.params.pid);
  
  // Obtener los campos actualizados del cuerpo de la solicitud
  const updatedFields = req.body;
  
  // Actualizar el producto
  const result = productsManager.updateProduct(productId, updatedFields);
  
  // Comprobar si hubo un error al actualizar el producto
  if (typeof result === 'string') {
    res.status(404).json({ error: result });
  } else {
    // Devolver el producto actualizado
    res.json(result);
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  // Obtener el ID del producto de los parámetros de la solicitud
  const productId = parseInt(req.params.pid);
  
  // Eliminar el producto
  const result = productsManager.deleteProduct(productId);
  
  // Comprobar si hubo un error al eliminar el producto
  if (typeof result === 'string') {
    res.status(404).json({ error: result });
  } else {
    // Devolver el producto eliminado
    res.json(result);
  }
});

export default router;

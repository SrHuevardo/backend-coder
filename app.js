import express from 'express';
import ProductManager from "./ProductManager.js"

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.urlencoded({extended:true}))

// Endpoint para obtener todos los productos, con un límite opcional
app.get('/products', (req, res) => {
    const limit = req.query.limit; // Obtener el valor del parámetro 'limit' de los query parameters
    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts(); // Obtener los productos de ProductManager, limitando si se proporcionó un límite
    res.json(products); // Devolver los productos en formato JSON
});

// Endpoint para obtener un producto específico por su ID
app.get('/products/:pid', (req, res) => {
    const productId = req.params.pid; // Obtener el valor del parámetro 'pid' de req.params
    const product = productManager.getProductById(productId); // Buscar el producto por su ID utilizando ProductManager
    
    if (product) {
      res.json(product); // Devolver el producto encontrado en formato JSON
    } else {
      res.status(404).json({ error: 'Producto no encontrado' }); // Devolver un código de estado 404 y un objeto JSON de error si el producto no se encontró
    }
});

app.listen(port)
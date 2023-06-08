import express from 'express';
import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`server funcionando en el puerto ${PORT}`);
});


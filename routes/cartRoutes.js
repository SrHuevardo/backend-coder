import express from 'express';
import CartsManager from '../CartsManager.js';

const router = express.Router();
const cartsManager = new CartsManager('carts');

// Ruta raíz POST /api/carts/
router.post("/", (req, res) => {
	try {
		// Agregar un nuevo carrito
		cartsManager.addCart();
		res.status(200).send("Cart added");
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Ruta GET /api/carts/:cid
router.get("/:cid", (req, res) => {
	try {
		// Tomar el ID del carrito de los parámetros de la solicitud
		const { cid } = req.params;
		const cartId = parseInt(cid);

		// Obtener los productos del carrito con el ID proporcionado
		const cart = cartsManager.getCartById(cartId);
		res.status(200).json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Ruta POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", (req, res) => {
	try {
		// Tomar los IDs del carrito y del producto de los parámetros de la solicitud
		const { cid, pid } = req.params;
		const cartId = parseInt(cid);
		const productId = parseInt(pid);

		// Agregar el producto al carrito con el ID proporcionado
		cartsManager.addProductToCart(cartId, productId);

		// Obtener los productos actualizados del carrito
		const cart = cartsManager.getCartById(cartId);
		res.status(200).json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;

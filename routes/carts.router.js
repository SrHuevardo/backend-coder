import { Router } from "express";
import { cartModel } from "../dao/mongo/models/cart.model.js";
import { productModel } from "../dao/mongo/models/product.model.js";

const carts = Router();

// Endpoint para obtener todos los carritos:
carts.get("/", async (req, res) => {
	try {
		let result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener un carrito según ID:
carts.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let result = await cartModel.findById(id).populate('products._id');

		if (!result) {
			return res.status(200).send(`There's no cart with ID ${id}`);
		};

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un carrito:
carts.post("/", async (req, res) => {
	try {
		const result = await cartModel.create({
			products: [],
		});

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un producto a un carrito segun IDs:
carts.post("/:cid/product/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const newProduct = await productModel.findById(pid);
		const cart = await cartModel.findById(cid);

		// Validar si el producto existe en el carrito:
		const productInCart = cart.products.find(product => product._id.toString() === newProduct.id);

		// Si no existe, crearlo:
		if (!productInCart) {
			const create = {
				$push: { products: { _id: newProduct.id, quantity: 1 } },
			};
			await cartModel.findByIdAndUpdate({ _id: cid }, create);

			const result = await cartModel.findById(cid);
			return res.status(200).json({ status: "success", payload: result });
		};

		// Si existe, aumentar la cantidad en una unidad:
		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $inc: { "products.$[elem].quantity": 1 } },
			{ arrayFilters: [{ "elem._id": newProduct.id }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para actualizar un carrito según ID con un arreglo de productos:
carts.put("/:cid", async (req, res) => {
	try {

		// Lógic

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para actualizar la cantidad de un producto dentro de un carrito según IDs:
carts.put("/:cid/products/:pid", async (req, res) => {
	try {

		// Lógic

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar todos los productos de un carrito según ID:
carts.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await cartModel.findByIdAndUpdate(id, {products: []});

		const result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar un productos de un carrito según IDs:
carts.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		await cartModel.findByIdAndUpdate(cid, {
			$pull: { products: { _id: pid } }
		})

		const result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default carts;
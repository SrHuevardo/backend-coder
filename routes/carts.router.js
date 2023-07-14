import { Router } from "express";
import { cartModel } from "../dao/mongo/models/cart.model.js";
import { productModel } from "../dao/mongo/models/product.model.js";

const carts = Router();

// Endpoint para obtener todos los carritos:  localhost:8080/api/carts/
carts.get("/", async (req, res) => {
	try {
		let result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para obtener un carrito según ID:  localhost:8080/api/carts/64b06894618f8465bd2b14ec
carts.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let result = await cartModel.findById(id);

		if (!result) {
			return res.status(200).send(`There's no cart with ID ${id}`);
		};

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un carrito: localhost:8080/api/carts/
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

// Endpoint para agregar un producto a un carrito segun IDs:  localhost:8080/api/carts/64b08f9305e34ad3373a737e/product/64b08d71d7eb2e234d4af1be
carts.post("/:cid/product/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const newProduct = await productModel.findById(pid);
		const cart = await cartModel.findById(cid);

		// Validar si el producto existe en el carrito:
		const productInCart = await cart.products.find(product => product.code === newProduct.code);

		// Si no existe, crearlo:
		if (!productInCart) {
			const create = {
				$push: { products: { code: newProduct.code, quantity: 1 } },
			};
			await cartModel.findByIdAndUpdate({ _id: cid }, create);

			const result = await cartModel.findById(cid);
			return res.status(200).json({ status: "success", payload: result });
		};

		// Si existe, aumentar la cantidad en una unidad:
		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $inc: { "products.$[elem].quantity": 1 } },
			{ arrayFilters: [{ "elem.code": newProduct.code }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar un carrito según ID:
carts.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await cartModel.deleteOne({ _id: id });
		const result = await cartModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});


// Endpoint para eliminar un producto del carrito según IDs:
carts.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const cart = await cartModel.findById(cid);

	if (!cart) {
		return res.status(404).json({ error: `Cart with ID ${cid} not found` });
	}

	// Filtrar los productos del carrito para excluir el producto a eliminar
	cart.products = cart.products.filter((product) => product.code !== pid);

	// Guardar el carrito actualizado en la base de datos
	await cart.save();
	return res
		.status(200)
		.json({ status: "success", message: "Product removed from cart" });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});


// Endpoint para actualizar la cantidad de ejemplares de un producto en el carrito según IDs:
carts.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		const cart = await cartModel.findById(cid);

	if (!cart) {
		return res.status(404).json({ error: `Cart with ID ${cid} not found` });
	}

	// Buscar el producto en el carrito
	const product = cart.products.find((p) => p.code === pid);

	if (!product) {
		return res.status(404).json({ error: `Product with code ${pid} not found in the cart` });
	}

	// Actualizar la cantidad de ejemplares del producto
	product.quantity = quantity;

	// Guardar el carrito actualizado en la base de datos
	await cart.save();

	return res
		.status(200)
		.json({ status: "success", message: "Product quantity updated in cart" });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});


export default carts;
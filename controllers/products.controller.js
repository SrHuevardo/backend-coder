import { productModel } from '../dao/mongo/models/product.model.js';

const products = async (req, res) => {
	try {
		const result = await productModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

const product = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await productModel.findById(id);

		if (!result) {
			return res.status(400).send(`There's no product with ID ${id}`);
		};

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

const createProduct = async (req, res) => {
	try {
		const { title, description, code, price, stock, category } = req.body;

		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			!category ||
			!price
		) {
			return res.status(400).send(`Please complete all the fields to create a product`);
		};

		const result = await productModel.create({
			title,
			description,
			code: code.replace(/\s/g, "").toLowerCase(),
			price,
			stock,
			category: category.toLowerCase(),
		});

		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, code, price, stock, category } = req.body;
		const product = await productModel.findById(id);

		if (!product) {
			return res.status(400).send(`There's no product with ID ${id}`);
		};

		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			!category ||
			!price
		) {
			return res.status(400).send(`Please complete all the fields to update a product`);
		};
		
		const newproduct = {
			title,
			description,
			code: code.replace(/\s/g, "").toLowerCase(),
			price,
			stock,
			category: category.toLowerCase(),
		};
		await productModel.updateOne({ _id: id }, newproduct);

		const result = await productModel.findById(id);
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		await productModel.deleteOne({ _id: id });

		const result = await productModel.find();
		return res.status(200).json({ status: "success", payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

export default {
	products,
	product,
	createProduct,
	updateProduct,
	deleteProduct,
};
// Express
import { Router } from "express";
const views = Router();

// Mongoose
import { productModel } from "../dao/mongo/models/product.model.js";

// Endpoint para renderizar el home:
views.get("/", async (req, res) => {
	try {
		let { limit, page, query, sort } = req.query;

		// Validación de Page:
		if (page == undefined || page == "" || page < 1 || isNaN(page)) {
			page = 1
		};

		// Validación de Limit:
		if (limit == undefined || limit == "" || limit <= 1 || isNaN(limit)) {
			limit = 10
		};

		// Validación de Sort:
		if (sort == undefined || (sort !== 'asc' && sort !== 'desc') || !isNaN(sort)) {
			sort = "asc";
		};

		const filter = {category: query};
		const options = {
			page,
			limit,
			customLabels: {
				totalPages: 'totalPages',
				hasPrevPage: 'hasPrevPage',
				hasNextPage: 'hasNextPage',
				prevPage: 'prevPage',
				nextPage: 'nextPage',
				docs: 'data',
			},
			lean: true
		};

		const products = await productModel.paginate({}, options);
		const filteredProducts = await productModel.paginate(filter, options);

		// Ordenar data según sort:
		if (sort === "asc") {
			// Ascendente
			filteredProducts.data.sort((a, b) => a.price - b.price);
			products.data.sort((a, b) => a.price - b.price);
		} else {
			// Descendente
			filteredProducts.data.sort((a, b) => b.price - a.price);
			products.data.sort((a, b) => b.price - a.price);
		}

		// Validar si las búsquedas son válidas:
		if (products.data.length <= 0) {
			return res.status(200).send(`There's no products for this search`);
		};

		if (filteredProducts.data.length > 0) {
			return res.status(200).render("home", {
				status: "success",
				payload: filteredProducts.data,
				page: page,
				limit,
				query,
				sort,
				totalPages: filteredProducts.totalPages,
				hasPrevPage: filteredProducts.hasPrevPage,
				hasNextPage: filteredProducts.hasNextPage,
				prevPage: filteredProducts.prevPage,
				nextPage: filteredProducts.nextPage,
				documentTitle: "Home",
				style: "styles.css",
			});
		}

		return res.status(200).render("home", {
			status: "success",
			payload: products.data,
			page: page,
			limit,
			query,
			sort,
			totalPages: products.totalPages,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			documentTitle: "Home",
			style: "styles.css",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para renderizar productos con socket:
views.get("/realtimeproducts", (req, res) => {
	try {
		return res.status(200).render("realTimeProducts", {
			style: "styles.css",
			documentTitle: "Socket",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para renderizar chat con socket:
views.get("/chat", (req, res) => {
	try {
		return res.status(200).render("chat", {
			style: "styles.css",
			documentTitle: "Chat",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default views;
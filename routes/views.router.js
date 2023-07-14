// Express
import { Router } from "express";
const views = Router();

// Data
import products from "../data/products.json" assert { type: "json" };

// Endpoint para renderizar el home:
views.get("/", (req, res) => {
	res.render("home", {
		style: "styles.css",
		documentTitle: "Home",
		products,
	});
});

// Endpoint para renderizar productos con socket:
views.get("/realtimeproducts", (req, res) => {
	res.render("realTimeProducts", {
		style: "styles.css",
		documentTitle: "Socket",
	});
});

// Endpoint para renderizar chat con socket:
views.get("/chat", (req, res) => {
	res.render("chat", {
		style: "styles.css",
		documentTitle: "Chat",
	});
});

export default views;
import express from 'express';
import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

import viewsRoute from "./routes/views.router.js";
import products from "./data/products.json" assert { type: "json" };
import { Server } from "socket.io";

// Handlebars
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));



// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use("/", viewsRoute);

// Server en 8080
const httpServer = app.listen(PORT, () => {
	console.log(`server funcionando en el puerto ${PORT}`);
});
// Server io
const io = new Server(httpServer);
io.on("connection", (socket) => {
	console.log("Cliente nuevo conectado");

	// Enviar productos
	socket.emit("products", products);

	socket.on("disconnect", () => {
		console.log("Cliente nuevo desconectado");
	});
});
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const host = "0.0.0.0";
const app = express();
const port = 8080;

// Rutas
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import { Server } from "socket.io";

// Data
import products from "./data/products.json" assert { type: "json" };


// Mongoose
import mongoose from "mongoose";
import { messageModel } from "./dao/mongo/models/messages.model.js";
mongoose.connect(
	"mongodb+srv://nicolasfsacco:ecommerce@cluster0.8gwzuq1.mongodb.net/?retryWrites=true&w=majority"
);


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
app.use('/api/products', productsRoute);

// Rutas de carritos
app.use('/api/carts', cartsRoute);

// Rutas de vistas
app.use("/", viewsRoute);

// Server en 8080
const httpServer = app.listen(port, host, () => {
	console.log(`Server listening on http://${host}:${port}`);
});
// Server io
const io = new Server(httpServer);
const messages = [];

io.on("connection", (socket) => {
	console.log("New client connected");

	socket.emit("products", products);

	// Chat
	io.emit("messagesLogs", messages);
	
	socket.on("user", (data) => {
		messages.push(data);
		io.emit("messagesLogs", messages);
	});

	socket.on("message", (data) => {
		messages.push(data);
		io.emit("messagesLogs", messages);
		messageModel.create({
			user: data.user,
			message: data.message,
		});
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});
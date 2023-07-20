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
import messagesRoute from "./routes/messages.router.js";
import cookiesRoute from "./routes/cookies.router.js";
import sessionsRoute from "./routes/sessions.router.js";
import { Server } from "socket.io";

// Data
import products from "./data/products.json" assert { type: "json" };


// Mongoose
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from 'express-session'; 
import { messageModel } from "./dao/mongo/models/messages.model.js";
import { productModel } from "./dao/mongo/models/product.model.js";
const mongoUrl = "mongodb+srv://nicolasfsacco:ecommerce@cluster0.8gwzuq1.mongodb.net/?retryWrites=true&w=majority";
const enviroment = async () => {await mongoose.connect(mongoUrl)};
enviroment();
app.use(session({
	store: MongoStore.create({mongoUrl}),
	secret: "asd3ñc3okasod",
	resave: false,
	saveUninitialized: false,
}));

//Passport
import passport from "passport";
import initializePassport from './config/passport.config.js';
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());




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
//Rutas de cookies
app.use("/api/cookies", cookiesRoute);
//Rutas de sesiones
app.use("/api/sessions", sessionsRoute);
//Rutas de mensajes
app.use("/api/messages", messagesRoute);

// Server en 8080
const httpServer = app.listen(port, host, () => {
	console.log(`Server up on http://${host}:${port}`);
});

const io = new Server(httpServer);

io.on("connection", async socket => {
	console.log(`Client ${socket.id} connected`);

	// Buscar productos en DB, escuchar cambios y enviar data:
	const products = await productModel.find().lean();
	io.emit("products", products);

	productModel.watch().on("change", async change => {
		const products = await productModel.find().lean();
		io.emit("products", products);
	});

	// Recibir usuarios, mensajes y crear entrada en DB:
	socket.on("user", async data => {
		await messageModel.create({
			user: data.user,
			message: data.message,
		});

		const messagesDB = await messageModel.find();
		io.emit("messagesDB", messagesDB);
	});

	socket.on("message", async data => {
		await messageModel.create({
			user: data.user,
			message: data.message,
		});

		const messagesDB = await messageModel.find();
		io.emit("messagesDB", messagesDB);
	});

	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} disconnected`);
	});
});
// inicio sesion login

// admin
// adminCod3r123 
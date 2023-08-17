import express from 'express';

const host = "0.0.0.0";
const app = express();
const port = 8080;
import __dirname from "./utils.js";

// Env
import config from './config.js'
const mongoUrl = config.MONGO_URL;
const mongoSessionSecret = config.MONGO_SESSION_SECRET;

// Rutas
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import messagesRoute from "./routes/messages.router.js";
import cookiesRoute from "./routes/cookies.router.js";
import sessionsRoute from "./routes/sessions.router.js";
import { Server } from "socket.io";
import forkRoute from './routes/fork.router.js';

// Router
import router from './router/router.js';

// Custom routers
import CustomUsersRouter from './routes/customUsers.router.js';
const customUsersRouter = new CustomUsersRouter();
import CustomSessionsRouter from './routes/custom.Sessions.router.js';
const customSessionsRouter = new CustomSessionsRouter();


// Mongoose
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from 'express-session'; 
import { messageModel } from "./dao/mongo/models/messages.model.js";
import { productModel } from "./dao/mongo/models/product.model.js";
const enviroment = async () => {
	await mongoose.connect(mongoUrl);
};
enviroment();
app.use(
	session({
		store: MongoStore.create({ mongoUrl }),
		secret: mongoSessionSecret,
		resave: false,
		saveUninitialized: true,
	})
);


//Passport
import passport from "passport";
import initializePassport from './config/passport.config.js';
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());




// Handlebars
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// Cookie parser
import cookieParser from 'cookie-parser';

// Morgan
import morgan from 'morgan';

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use("/", viewsRoute);
app.use("/api/cookies", cookiesRoute);
app.use("/api/sessions", sessionsRoute);
app.use("/api/messages", messagesRoute);
app.use('/api/custom/users', customUsersRouter.getRouter());
app.use('/api/custom/sessions', customSessionsRouter.getRouter());
app.use('/api/fork', forkRoute);
router(app);


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





// import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
// Data
// import products from "./data/products.json" assert { type: "json" };

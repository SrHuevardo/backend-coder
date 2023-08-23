import { Router } from "express";
import { authToken } from "../utils/jwt.utils.js";
import viewsController from "../controllers/views.controller.js"

const views = Router();

views.get("/", viewsController.home);
views.get("/login", viewsController.login);
views.get("/register", viewsController.register);
views.get("/products", viewsController.products);
views.get("/product", viewsController.product);
views.get("/carts", viewsController.carts);
views.get("/exclusive", authToken, viewsController.exclusive);

export default views;
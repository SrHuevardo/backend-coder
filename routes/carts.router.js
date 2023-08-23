import { Router } from "express";
import cartsController from "../controllers/carts.controller.js"

const carts = Router();

carts.get("/", cartsController.carts);
carts.get("/:id", cartsController.cart);
carts.post("/", cartsController.createCart);
carts.get("/:cid/product/:pid", cartsController.addProduct);
carts.put("/:cid", cartsController.updateCart);
carts.put("/:cid/product/:pid", cartsController.updateProduct);
carts.delete("/:id", cartsController.deleteCart);
carts.delete("/:cid/products/:pid", cartsController.deleteProduct);

export default carts;
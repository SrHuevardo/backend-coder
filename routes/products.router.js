import { Router } from "express";
import productsController from "../controllers/products.controller.js"

const products = Router();

products.get("/", productsController.products);
products.get("/:id", productsController.product);
products.post("/", productsController.createProduct);
products.put("/:id", productsController.updateProduct);
products.delete("/:id", productsController.deleteProduct);

export default products;
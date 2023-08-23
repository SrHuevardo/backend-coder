import authController from "../controllers/auth.controller.js";
import adminController from "../controllers/admin.controller.js";
import viewsRoute from './views.router.js';
import sessionsRoute from './sessions.router.js';
import productsRoute from './products.router.js';
import cartsRoute from './carts.router.js';

const router = (app) => {
  app.use("/auth", authController);
  app.use("/admin", adminController);

  app.use("/", viewsRoute);
  app.use("/api/sessions", sessionsRoute);
  app.use("/api/products", productsRoute);
  app.use("/api/carts", cartsRoute);
};

export default router;
import { Router } from "express";
import autAdminMiddelware from "../middlewares/authAdmin-middleware.js";
import ProductLineController from "../controllers/productline-controller.js";

const ProductLineRouter = new Router();

ProductLineRouter.post("/", autAdminMiddelware, ProductLineController.create);
ProductLineRouter.get("/", ProductLineController.getAll);
ProductLineRouter.get("/with-items", ProductLineController.getAllWithItems);
ProductLineRouter.get(
   "/:id",
   autAdminMiddelware,
   ProductLineController.getById
);
ProductLineRouter.delete(
   "/:id",
   autAdminMiddelware,
   ProductLineController.delete
);
ProductLineRouter.put("/:id", autAdminMiddelware, ProductLineController.update);
ProductLineRouter.put("/up/:id", autAdminMiddelware, ProductLineController.up);
ProductLineRouter.put(
   "/down/:id",
   autAdminMiddelware,
   ProductLineController.down
);

export default ProductLineRouter;

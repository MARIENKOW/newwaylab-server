import { Router } from "express";
import siteController from "../controllers/site-controller.js";


const SiteRouter = new Router();

SiteRouter.post("/sendTelegram", siteController.sendTelegram);
SiteRouter.post("/", siteController.setContactLinks);
SiteRouter.get("/", siteController.getContactLinks);

export default SiteRouter;

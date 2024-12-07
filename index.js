import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import AdminRouter from "./routers/AdminRouter.js";
import ItemRouter from "./routers/ItemRouter.js";
import BlogRouter from "./routers/BlogRouter.js";
import fileUpload from "express-fileupload";

import telegramService from "./services/telegram-service.js";
import ProductLineRouter from "./routers/ProductLineRouter.js";
import SiteRouter from "./routers/SiteRouter.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
   })
);

app.use(process.env.NFT_FOLDER, express.static("./" + process.env.NFT_FOLDER));
app.use("/Admin", AdminRouter);
app.use("/Item", ItemRouter);
app.use("/Blog", BlogRouter);
app.use("/ProductLine", ProductLineRouter);
app.use("", SiteRouter);

const web = http.Server(app);

try {
   web.listen(PORT, process.env.SERVER_URL, () =>
      console.log("Server is working")
   );
} catch (e) {
   console.log(`${e.message}`);
}

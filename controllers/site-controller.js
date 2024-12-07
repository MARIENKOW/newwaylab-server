import bcrypt from "bcrypt";
import token from "../services/token-service.js";
import { Admin } from "../models/Admin.js";
import telegramService from "../services/telegram-service.js";
import { Site } from "../models/Site.js";

class Controller {
   sendTelegram = async (req, res) => {
      try {
         const { name, email, phone, description } = req.body;
         if (!name || !email || !phone)
            return res.status(400).json({ "root.server": "Некоректні данні" });

         await telegramService.send(`
            Ім'я: ${name}\nEmail: ${email}\nНомер телефону: +38${phone}\n${
            description ? "Опис: " + description : ""
         }`);
         res.status(200).json(true);
      } catch (e) {
         console.log(e);
         res.status(500).json(e.message);
      }
   };
   getContactLinks = async (req, res) => {
      try {
         const siteData = await Site.findOne({
            order: [["id", "DESC"]],
         });
         res.status(200).json(siteData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e.message);
      }
   };
   setContactLinks = async (req, res) => {
      try {
         const data = req.body;

         const siteData = await Site.findOne({
            order: [["id", "DESC"]],
         });

         if (siteData?.id) {
            await Site.update({ ...data }, { where: { id: siteData?.id } });
         } else {
            await Site.create({ ...data });
         }
         const siteDataReturn = await Site.findOne({
            order: [["id", "DESC"]],
         });

         res.status(200).json(siteDataReturn);
      } catch (e) {
         console.log(e);
         res.status(500).json(e.message);
      }
   };
}
export default new Controller();

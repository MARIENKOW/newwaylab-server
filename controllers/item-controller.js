import { Op } from "sequelize";
import { Item } from "../models/Item.js";
import imgService from "../services/img-service.js";
import { Img } from "../models/Img.js";
import { ProductLine } from "../models/ProductLine.js";
import itemService from "../services/item-service.js";

class Controller {
   create = async (req, res) => {
      try {
         const { name, productLine_id } = req.body;

         const img = req?.files?.img;

         if (!name || !img || !productLine_id)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const productLineData = await ProductLine.findOne({
            where: {
               id: productLine_id,
            },
         });
         if (!productLineData)
            return res.status(404).json("Not found product line");

         let place = 0;

         const itemsData = await Item.findAll({
            order: [["place", "DESC"]],
            limit: 1,
            where: {
               productLine_id,
            },
         });

         if (itemsData.length !== 0) {
            place = itemsData[0].place;
         }

         place++;

         const { img_id } = await imgService.save(img);

         try {
            const { id } = await Item.create({
               name,
               img_id,
               productLine_id,
               place,
            });
            return res.status(200).json(id);
         } catch (error) {
            await imgService.delete(img_id);
            throw error;
         }
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getByLine = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("productLine_id is not found");

         const ItemData = await Item.findAll({
            where: {
               productLine_id: id,
            },
            order: [["id", "DESC"]],
            include: [
               {
                  model: Img,
                  as: "img",
                  required: true,
               },
            ],
         });

         if (!ItemData) return res.status(404).json("Not found item");
         return res.status(200).json(ItemData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getById = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const itemData = await Item.findOne({
            where: {
               id,
            },
            include: [
               {
                  model: Img,
                  as: "img",
                  required: true,
               },
               {
                  model: ProductLine,
                  as: "productLine",
                  required: true,
               },
            ],
         });
         if (!itemData) return res.status(404).json("Not found item");
         return res.status(200).json(itemData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   delete = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const itemData = await Item.findOne({
            where: {
               id,
            },
            include: [
               {
                  model: Img,
                  as: "img",
                  required: true,
               },
            ],
         });

         if (!itemData) return res.status(404).json("item is not found");

         const { img_id, img, id: item_id } = itemData;

         await itemData.destroy({ where: { id: item_id } });

         try {
            console.log(img_id);
            await imgService.delete(img_id); //!   maybe delete
         } catch (error) {
            console.log(error);
         }

         return res.status(200).json(true);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   update = async (req, res) => {
      try {
         const data = req.body;

         const { id } = req.params;

         const img = req?.files?.img;

         if (!data || !id)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const itemData = await Item.findOne({
            where: {
               id,
            },
            include: [
               {
                  model: Img,
                  as: "img",
                  required: true,
               },
            ],
         });

         if (!itemData) return res.status(404).json("item not found");

         if (img) {
            const imageData = await imgService.save(img);
            data.img_id = imageData.img_id;
         }

         try {
            const updateUserData = await Item.update(
               {
                  ...data,
               },
               { where: { id: itemData.id } }
            );
         } catch (error) {
            if (img) {
               await imgService.delete(data.img_id);
            }
            throw error;
         }
         try {
            if (img) {
               console.log(itemData.img_id);
               await imgService.delete(itemData.img_id);
            }
         } catch (error) {
            console.log("not delete item img");
         }
         return res.status(200).json(itemData.id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   up = async (req, res) => {
      try {
         const { id } = req.params;

         if (!id)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const itemData = await Item.findOne({
            where: {
               id,
            },
         });

         if (!itemData) return res.status(404).json("item not found");

         const checkItemPlace = await Item.findOne({
            where: {
               place: itemData.place,
            },
         });

         if (checkItemPlace) {
            await itemService.changePlaces(itemData.productLine_id);
         }

         const itemDataNew = await Item.findOne({
            where: {
               id,
            },
         });

         const itemFirst = await Item.findOne({
            where: {
               place: { [Op.lt]: itemDataNew.place },
            },
            order: [["place", "DESC"]],
         });

         console.log(itemFirst);

         if (!itemFirst) return res.status(400).json("item is first");

         await Item.update(
            {
               place: itemFirst.place,
            },
            { where: { id: itemDataNew.id } }
         );
         await Item.update(
            {
               place: itemDataNew.place,
            },
            { where: { id: itemFirst.id } }
         );

         return res.status(200).json(itemData.id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   down = async (req, res) => {
      try {
         const { id } = req.params;

         if (!id)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const itemData = await Item.findOne({
            where: {
               id,
            },
         });

         if (!itemData) return res.status(404).json("item not found");

         const checkItemPlace = await Item.findOne({
            where: {
               place: itemData.place,
            },
         });

         if (checkItemPlace) {
            await itemService.changePlaces(itemData.productLine_id);
         }

         const itemDataNew = await Item.findOne({
            where: {
               id,
            },
         });

         const itemLast = await Item.findOne({
            where: {
               place: { [Op.gt]: itemDataNew.place },
            },
            order: [["place", "ASC"]],
         });

         if (!itemLast) return res.status(400).json("item is last");

         await Item.update(
            {
               place: itemLast.place,
            },
            { where: { id: itemDataNew.id } }
         );
         await Item.update(
            {
               place: itemDataNew.place,
            },
            { where: { id: itemLast.id } }
         );

         return res.status(200).json(itemData.id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
}
export default new Controller();

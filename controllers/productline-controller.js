import { Item } from "../models/Item.js";
import { Img } from "../models/Img.js";
import { ProductLine } from "../models/ProductLine.js";
import { Op } from "sequelize";

class Controller {
   create = async (req, res) => {
      try {
         const { name } = req.body;

         if (!name)
            return res.status(400).json({ "root.server": "Incorrect values" });

         let place = 0;

         const productLinesData = await ProductLine.findAll({
            order: [["place", "DESC"]],
            limit: 1,
         });

         console.log(productLinesData);

         if (productLinesData.length !== 0) {
            place = productLinesData[0].place;
         }

         place++;

         const { id } = await ProductLine.create({
            name,
            place,
         });

         return res.status(200).json(id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getAll = async (req, res) => {
      try {
         const productLineData = await ProductLine.findAll({
            include: [
               {
                  model: Item,
                  as: "items",
                  include: [
                     {
                        model: Img,
                        as: "img",
                        required: true,
                     },
                  ],
               },
            ],
            order: [["place", "ASC"]],
         });

         return res.status(200).json(productLineData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getAllWithItems = async (req, res) => {
      try {
         const productLineData = await ProductLine.findAll({
            include: [
               {
                  model: Item,
                  as: "items",
                  required: true,
                  include: [
                     {
                        model: Img,
                        as: "img",
                        required: true,
                     },
                  ],
               },
            ],
            order: [["place", "ASC"]],
         });

         return res.status(200).json(productLineData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getById = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const productLineData = await ProductLine.findOne({
            where: {
               id,
            },
            include: [
               {
                  model: Item,
                  as: "items",
                  include: [
                     {
                        model: Img,
                        as: "img",
                     },
                  ],
               },
            ],
         });
         if (!productLineData)
            return res.status(404).json("Not found product line");
         return res.status(200).json(productLineData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   delete = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const productLineData = await ProductLine.findOne({
            where: {
               id,
            },
         });

         if (!productLineData)
            return res.status(404).json("product line is not found");

         const { id: productLine_id } = productLineData;

         await ProductLine.destroy({ where: { id: productLine_id } });

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

         if (!data || !id)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const productLineData = await ProductLine.findOne({
            where: {
               id,
            },
         });

         if (!productLineData)
            return res.status(404).json("product line not found");

         await ProductLine.update(
            {
               ...data,
            },
            { where: { id: productLineData.id } }
         );

         return res.status(200).json(productLineData.id);
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

         const productLineData = await ProductLine.findOne({
            where: {
               id,
            },
         });

         if (!productLineData)
            return res.status(404).json("product line not found");

         const productLineFirst = await ProductLine.findOne({
            where: {
               place: { [Op.lt]: productLineData.place },
            },
            order: [["place", "DESC"]],
         });

         console.log(productLineFirst);

         if (!productLineFirst)
            return res.status(400).json("product line is first");

         await ProductLine.update(
            {
               place: productLineFirst.place,
            },
            { where: { id: productLineData.id } }
         );
         await ProductLine.update(
            {
               place: productLineData.place,
            },
            { where: { id: productLineFirst.id } }
         );

         return res.status(200).json(productLineData.id);
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

         const productLineData = await ProductLine.findOne({
            where: {
               id,
            },
         });

         if (!productLineData)
            return res.status(404).json("product line not found");

         const productLineLast = await ProductLine.findOne({
            where: {
               place: { [Op.gt]: productLineData.place },
            },
            order: [["place", "ASC"]],
         });

         console.log(productLineLast);

         if (!productLineLast)
            return res.status(400).json("product line is last");

         await ProductLine.update(
            {
               place: productLineLast.place,
            },
            { where: { id: productLineData.id } }
         );
         await ProductLine.update(
            {
               place: productLineData.place,
            },
            { where: { id: productLineLast.id } }
         );

         return res.status(200).json(productLineData.id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
}
export default new Controller();

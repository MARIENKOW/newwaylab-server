import { Op } from "sequelize";
import { Blog } from "../models/Blog.js";
import imgService from "../services/img-service.js";
import { Img } from "../models/Img.js";

class Controller {
   create = async (req, res) => {
      try {
         const { title, body } = req.body;

         const img = req?.files?.img;

         if (!title || !img || !body)
            return res.status(400).json({ "root.server": "Incorrect values" });

         const { img_id } = await imgService.save(img);

         try {
            const { id } = await Blog.create({
               title,
               img_id,
               body,
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
   getAll = async (req, res) => {
      try {
         const blogData = await Blog.findAll({
            include: [
               {
                  model: Img,
                  as: "img",
                  required: true,
               },
            ],
            order: [["id", "DESC"]],
         });

         return res.status(200).json(blogData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   getById = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const blogData = await Blog.findOne({
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
         if (!blogData) return res.status(404).json("Not found blog");
         return res.status(200).json(blogData);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
   delete = async (req, res) => {
      try {
         const { id } = req.params;
         if (!id) return res.status(400).json("id is not found");
         const blogData = await Blog.findOne({
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

         if (!blogData) return res.status(404).json("blog is not found");

         const { img_id, id: blog_id } = blogData;

         await blogData.destroy({ where: { id: blog_id } });

         try {
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

         const blogData = await Blog.findOne({
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

         if (!blogData) return res.status(404).json("blog not found");

         if (img) {
            const imageData = await imgService.save(img);
            data.img_id = imageData.img_id;
         }

         try {
            const updateUserData = await Blog.update(
               {
                  ...data,
               },
               { where: { id: blogData.id } }
            );
         } catch (error) {
            if (img) {
               await imgService.delete(data.img_id);
            }
            throw error;
         }
         try {
            if (img) {
               await imgService.delete(blogData.img_id);
            }
         } catch (error) {}
         return res.status(200).json(blogData.id);
      } catch (e) {
         console.log(e);
         res.status(500).json(e?.message);
      }
   };
}
export default new Controller();

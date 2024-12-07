import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";


export const Blog = sequelize.define(
   "Blog",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      title: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      img_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      body: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
   },
   {
      tableName: "blog",
      timestamps: false,
   }
);



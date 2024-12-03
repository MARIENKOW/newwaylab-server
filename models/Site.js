import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";

export const Site = sequelize.define(
   "Site",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      email: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      inst: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      tiktok: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      telegram: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      phone: {
         type: DataTypes.STRING(10),
         allowNull: true,
      },
   },
   {
      tableName: "site",
      timestamps: false,
   }
);

import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define("category" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        category: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "category",
        timestamps: true
    }
)

export default Category
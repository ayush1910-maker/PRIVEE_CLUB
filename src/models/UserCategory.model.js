import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import Category from "./Category.model.js";


const UserCategory = sequelize.define("user_category" ,
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: "id",
            },
        onDelete: "CASCADE",
        },
    },
    {
        tableName: "user_category",
        timestamps: true
    }
)

export default UserCategory
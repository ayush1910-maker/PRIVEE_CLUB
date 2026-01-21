import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";

const FCMtoken = sequelize.define("fcm_tokens",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User, 
                key: "id",
            },
            onDelete: "CASCADE", 
        },
        fcm_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        device_type: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: "fcm_tokens",
        timestamps: true
    }
)

export default FCMtoken
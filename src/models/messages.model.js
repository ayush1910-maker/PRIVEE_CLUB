import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";

const Messages = sequelize.define("message", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, 
                key: "id",
            },
            onDelete: "CASCADE", 
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User, 
                key: "id",
            },
            onDelete: "CASCADE",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    },
    {
        tableName: "message",
        timestamps: true
    }
)

export default Messages
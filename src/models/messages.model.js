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
        message_type: {
            type: DataTypes.ENUM("text" , "image" , "file"),
            allowNull: false,
            defaultValue: "text"
        },
        file_url: {
            type: DataTypes.TEXT
        },
        file_name: {
            type: DataTypes.STRING
        },
        mime_type: {
            type: DataTypes.STRING
        },
        file_size: {
            type: DataTypes.STRING
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
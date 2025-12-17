import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const BlockUser = sequelize.define("block_user" , 
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
                model: "user",
                key: "id"
            },
            onDelete: "CASCADE"
        },

        blocked_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        tableName: "block_user",
        timestamps: true
    }
) 

export default BlockUser
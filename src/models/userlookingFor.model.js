import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const UserLookingFor = sequelize.define("user_looking_for" , 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User", 
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        looking_for_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "lookingFor",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "user_looking_for",
        timestamps: true
    }
)

export default UserLookingFor
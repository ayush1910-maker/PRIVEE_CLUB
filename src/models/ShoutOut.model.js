import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const ShoutOut = sequelize.define("shout_out" , 
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
                key: "id",
            },
            onDelete: "CASCADE",
        },

        shout_out: {
            type: DataTypes.STRING,
        },
        
        shout_out_image: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "shout_out",
        timestamps: true
    }
)

export default ShoutOut
import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const lookingFor = sequelize.define("looking_for" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
        }, 
        title: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: "looking_for",
        timestamps: true
    }
)

export default lookingFor
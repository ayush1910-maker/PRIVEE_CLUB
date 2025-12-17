import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const RatingTitles = sequelize.define("rating_titles" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING
        },

        score: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: "rating_titles",
        timestamps: true
    }
)

export default RatingTitles
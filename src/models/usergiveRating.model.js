import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const UserGiveRating = sequelize.define("user_give_rating" ,
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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

        rated_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onDelete: "CASCADE",
        },

        rating_titles_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "rating_titles",
                key: "id"
            },
            onDelete: "CASCADE"
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        
    },
    {
        tableName: "user_give_rating",
        timestamps: true
    }
)

export default UserGiveRating
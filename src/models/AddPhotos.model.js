import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const AddPhotos = sequelize.define("add_photos" , 
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
        
        photo_url: {
            type: DataTypes.JSON,
            allowNull: false
        }
    },
    {
        tableName: "add_photos",
        timestamps: true
    }
)

export default AddPhotos
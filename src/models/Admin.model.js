import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define("admin" ,
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "admin",
        timestamps: true
    }
)

export default Admin
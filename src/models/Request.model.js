import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Request = sequelize.define("requests" ,
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
                model: "user",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        status: {
            type: DataTypes.ENUM("Confirmed Request" , "Pending Request"),
            allowNull: false
        }
    },
    {
        tableName: "requests",
        timestamps: true
    }
)

export default Request
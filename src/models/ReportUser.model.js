import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const ReportUser = sequelize.define("report_user" , 
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

        target_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "report_user",
        timestamps: true

    }
)

export default ReportUser
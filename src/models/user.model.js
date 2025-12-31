import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("user" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        googleId: {
            type: DataTypes.STRING,
        },
        first_name: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            // allowNull: true
        },
        profile_name: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        mobile_number: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        upload_selfie: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: true,
        },
        looking_for: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // user info
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        body_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hair_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eye_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sexual_orientation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        education: {
            type: DataTypes.STRING,
            allowNull: true
        },
        feild_of_work: {
            type: DataTypes.STRING,
            allowNull: true
        },
        relationship_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zodiac_sign: {
            type: DataTypes.STRING,
            allowNull: true
        },
        smoking: {
            type: DataTypes.ENUM("Yes","No","Occasionally"),
            allowNull: true
        },
        drinking: {
            type: DataTypes.ENUM("Yes","No","Occasionally"),
            allowNull: true
        },
        tattoos: {
            type: DataTypes.ENUM("Yes","No"),
            allowNull: true
        },
        piericing: {
            type: DataTypes.ENUM("Yes","No"),
            allowNull: true
        },
        about_me: {
            type: DataTypes.STRING,
            allowNull: true
        },
        about_your_perfect_match: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // user intrests
        favourite_music: {
            type: DataTypes.STRING,
            allowNull: true
        },
        favourite_tv_show: {
            type: DataTypes.STRING,
            allowNull: true
        },
        favourite_movie: {
            type: DataTypes.STRING,
            allowNull: true
        },
        favourite_book: {
            type: DataTypes.STRING,
            allowNull: true
        },
        favourite_sport: {
            type: DataTypes.STRING,
            allowNull: true
        },
        other: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // hear about
        hear_about: {
            type: DataTypes.ENUM("Google","ChatGPT/AI","Instagram","Facebook", "Tik Tok"),
            allowNull: true
        },
        // forget and reset password
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otp_expires: {
            type: DataTypes.DATE,
            allowNull: true
        },

        rating_score: {
           type: DataTypes.FLOAT,
        },

        rating_count: {
           type: DataTypes.INTEGER,
           defaultValue: 0
        },

        token_version: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },

        force_logged_out: {
           type: DataTypes.BOOLEAN,
           defaultValue: false
        },
        last_login_at: {
            type: DataTypes.DATE,
        },

        fcm_token: {
            type: DataTypes.TEXT
        },
        login_type: {
            type: DataTypes.STRING
        },
        social_id: {
            type: DataTypes.STRING
        },
        device_type: {
            type: DataTypes.STRING
        }
        
    },
    
    {
        tableName: "user",
        timestamps: true
    }
)

export default User
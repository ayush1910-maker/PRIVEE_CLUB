import lookingFor from "../models/lookingFor.model.js"
import { ShoutOut } from "../utils/associations.js"
import User from "../models/user.model.js"
import UserLookingFor from "../models/userlookingFor.model.js"
import {AddPhotos , AddPrivatePhotos} from "../utils/associations.js"
import { Op } from "sequelize"

const getUserDetail = async (req ,res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id , {
            attributes: {
                exclude: ["password" , "otp" , "otp_expires" , "created_at" , "updated_at"],
            },
        })

        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        return res.json({
            status: true,
            message: "User details fetched successfully",
            data: user,
        });
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getAccountDetail = async (req, res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id , {
            attributes:  [
                "first_name",
                "last_name",
                "profile_name",
                "email",
                "mobile_number", 
                "date_of_birth",
                "gender"
            ]
        })

        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        return res.json({
            status: true,
            message: "Account Detail Fetched!",
            data: user
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const editAboutMe = async (req , res) => {
    try {
        const user_id = req.user.id
        const { about_me } = req.body

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        user.about_me = about_me
        user.save()

        return res.json({
            status: true,
            message: "About edited!",
            data: {
                about_me
            }
        })


    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const editPerfectMatch = async (req ,res) => {
    try {
        const user_id = req.user.id
        const { about_your_perfect_match } = req.body
        
        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        user.about_your_perfect_match = about_your_perfect_match
        await user.save()

        return res.json({
            status: true,
            message: "perfect match edited",
            data: {
                about_your_perfect_match
            }
        })
        
    } catch (error) {
        return res.send({status: false , message: error.message})
    }
}

const editUserInfo = async (req , res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const {
            height,
            weight,
            body_type,
            hair_color,
            eye_color,
            nationality,
            region,
            city,
            sexual_orientation,
            education,
            feild_of_work,
            relationship_status,
            zodiac_sign,
            smoking,
            drinking,
            tattoos,
            piericing,
            favourite_music,
            favourite_tv_show,
            favourite_movie,
            favourite_book,
            favourite_sport
        } = req.body

        const updateUserInfo = {
            height,
            weight,
            body_type,
            hair_color,
            eye_color,
            nationality,
            region,
            city,
            sexual_orientation,
            education,
            feild_of_work,
            relationship_status,
            zodiac_sign,
            smoking,
            drinking,
            tattoos,
            piericing,
            favourite_music,
            favourite_tv_show,
            favourite_movie,
            favourite_book,
            favourite_sport
        }

        const changedData = {}
        for (const [key, value] of Object.entries(updateUserInfo)) {
            if (value !== undefined && value !== null && value !== "") {
                changedData[key] = value;
            }
        }

        await user.update(changedData)

        return res.json({
            status: true,
            message: "saved",
            updated_info: changedData
        })
         
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const UploadPhotos = async (req, res) => {
    try {
        // user ko verify karna
        // photos ko upload karana hai
        // in bulk or single both

        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        if(!req.files || req.files.length === 0){
            return res.json({status: false , message: "No photos uploaded"})
        }

        const photosToInsert = req.files.map((file) => ({
            user_id,
            photo_url: file.filename
        }))

        const UploadPhotos = await AddPhotos.bulkCreate(photosToInsert)

        return res.json({
            status: true,
            message: "photos added successfully",
            data: UploadPhotos
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const UploadPrivatePhotos = async (req ,res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User Not found"})
        }

        if(!req.files || req.files.length === 0){
            return res.json({status: false , message: "no private photos uploaded"})
        }

        const photosToInsert = req.files.map((file) => ({
            user_id,
            photo_url: file.filename
        }))

        const UploadPrivatePhotos = await AddPrivatePhotos.bulkCreate(photosToInsert)

        return res.json({
            status: true,
            message: "Private Photos uploaded successfully!",
            data: UploadPrivatePhotos
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const editLookingFor = async (req, res) => {
    try {

        const user_id = req.user.id
        const {looking_for} = req.body

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "user not found"})
        }

        if(Array.isArray(looking_for)){
            looking_for = [looking_for]
        }

        const validTitles = await lookingFor.findAll({
            where: {id: looking_for}
        })

        if(validTitles.length !== looking_for.length){
            return res.json({status: false , message: "choose between validTitles"})
        }

        const oldRecords = await UserLookingFor.findAll({
            where: {user_id},
            attributes: ["looking_for_id"]
        })
        // oldRRecords give array of objects

        // ab old records fetch karne ke bad new records add karne hai
        // and dono ko merge karna hai

        const oldValues = oldRecords.map(i => i.looking_for_id)
        // oldValues  give => 1 , 2, 3 

        const merged = [...new Set([...oldValues , ...looking_for])]
        // Set -> ek typical data structure hota hai ** automatically remove duplicates


        // eg merged: [2,4,5] oldrecords: [2,4]
        const newValuesToInsert = merged
        .filter(id => !oldValues.includes(id)) // filter gives 5
        .map(id => ({
            user_id,
            looking_for_id: id
        }))
        
        await UserLookingFor.bulkCreate(newValuesToInsert)

        await User.update(
            {looking_for: JSON.stringify(looking_for)},
            { where: {id: user_id} }
        )

        return res.json({
            status: true,
            message: "edited successfully!",
            data: newValuesToInsert
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const giveShoutOut = async (req ,res) => {
    try {
        const user_id = req.user.id

        const { shout_out } = req.body

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const shoutoutData = {
            user_id,
            shout_out_image: req.file ? req.file.filename : null,
            shout_out
        }

        const shoutOut = await ShoutOut.create(shoutoutData)

        return res.json({
            status: true,
            message: "ShoutOut Posted successfully",
            data: shoutOut
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}


export {
   getUserDetail,
   getAccountDetail,
   editAboutMe,
   editPerfectMatch,
   editUserInfo,
   UploadPhotos,
   UploadPrivatePhotos,
   editLookingFor,
   giveShoutOut
}
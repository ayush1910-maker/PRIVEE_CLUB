import express from "express";
import Messages from "../models/messages.model.js";
import {upload} from "../utils/multer.js"


const router = express.Router()

router.post("/UploadFiles" , upload.single("file") , (req , res) => {
    if (!req.file) {
        return res.json({status: false , message: "no file uploaded"})
    }

    
    return res.json({
        status: true,
        file_url: `/uploads/${req.file.filename}`,
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype
    })
})

export default router
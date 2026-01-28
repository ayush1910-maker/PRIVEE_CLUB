import express from "express";
import Messages from "../models/messages.model.js";
import {upload} from "../utils/multer.js"


const router = express.Router()

router.post("/UploadFiles", upload.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No files uploaded"
      });
    }

    const files = req.files.map(file => ({
      file_url: `/uploads/${file.filename}`,
      file_name: file.originalname,
      file_size: file.size,
      mime_type: file.mimetype
    }));

    return res.json({
      status: true,
      files
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "File upload failed"
    });
  }
});


export default router